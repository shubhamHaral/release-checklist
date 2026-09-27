import { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from "@apollo/client";
import {
  ApolloProvider,
  useMutation,
  useQuery,
} from "@apollo/client/react";
import "./App.css";

const GET_RELEASES = gql`
  query {
    releases {
      id
      name
      date
      status
      additionalInfo
      steps {
        id
        name
        completed
      }
    }
  }
`;

const CREATE_RELEASE = gql`
  mutation CreateRelease(
    $name: String!
    $date: String!
    $additionalInfo: String
  ) {
    createRelease(
      name: $name
      date: $date
      additionalInfo: $additionalInfo
    ) {
      id
      name
      date
      status
      additionalInfo
      steps {
        id
        name
        completed
      }
    }
  }
`;

const TOGGLE_STEP = gql`
  mutation ToggleStep(
    $id: ID!
    $stepId: Int!
    $completed: Boolean!
  ) {
    toggleStep(
      id: $id
      stepId: $stepId
      completed: $completed
    ) {
      id
      status
      steps {
        id
        name
        completed
      }
    }
  }
`;

const UPDATE_RELEASE = gql`
  mutation UpdateRelease(
    $id: ID!
    $additionalInfo: String
  ) {
    updateRelease(
      id: $id
      additionalInfo: $additionalInfo
    ) {
      id
      additionalInfo
    }
  }
`;

const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id)
  }
`;

function App() {
  const { data, loading, error, refetch } =
    useQuery(GET_RELEASES);

  const [createRelease] = useMutation(CREATE_RELEASE);
  const [toggleStep] = useMutation(TOGGLE_STEP);
  const [updateRelease] = useMutation(UPDATE_RELEASE);
  const [deleteRelease] = useMutation(DELETE_RELEASE);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const create = async (e) => {
    e.preventDefault();

    if (!name || !date) return;

    await createRelease({
      variables: {
        name,
        date: new Date(date).toISOString(),
        additionalInfo,
      },
    });

    setName("");
    setDate("");
    setAdditionalInfo("");

    refetch();
  };

  const toggle = async (releaseId, stepId, completed) => {
    await toggleStep({
      variables: {
        id: releaseId,
        stepId,
        completed,
      },
      update: (cache, { data }) => {
        const updatedRelease = data?.toggleStep;

        if (!updatedRelease) return;

        cache.modify({
          id: cache.identify({
            __typename: "Release",
            id: releaseId,
          }),
          fields: {
            status() {
              return updatedRelease.status;
            },
            steps() {
              return updatedRelease.steps;
            },
          },
        });
      },
    });
  };

  const editInfo = async (release) => {
    const value = window.prompt(
      "Additional information:",
      release.additionalInfo || ""
    );

    if (value === null) return;

    await updateRelease({
      variables: {
        id: release.id,
        additionalInfo: value,
      },
      update: (cache, { data }) => {
        const updatedRelease = data?.updateRelease;

        if (!updatedRelease) return;

        cache.modify({
          id: cache.identify({
            __typename: "Release",
            id: release.id,
          }),
          fields: {
            additionalInfo() {
              return updatedRelease.additionalInfo;
            },
          },
        });
      },
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this release?")) return;

    await deleteRelease({
      variables: { id },
    });

    refetch();
  };

  if (loading) {
    return <div className="page-state">Loading releases...</div>;
  }

  if (error) {
    return (
      <div className="page-state error-state">
        Unable to connect to API.
      </div>
    );
  }

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">
        <div>
          <div className="brand">
            <div className="brand-icon">RC</div>

            <div>
              <h1>Release Checklist</h1>
              <p>Plan, track and manage software releases.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="content">

        {/* CREATE RELEASE */}
        <section className="create-card">
          <div className="section-title">
            <div>
              <h2>Create Release</h2>
              <p>Create a new release and track its checklist.</p>
            </div>
          </div>

          <form onSubmit={create} className="release-form">

            <div className="form-group">
              <label>Release name</label>

              <input
                type="text"
                placeholder="e.g. Version 2.0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Due date</label>

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Additional information</label>

              <textarea
                placeholder="Optional release notes..."
                value={additionalInfo}
                onChange={(e) =>
                  setAdditionalInfo(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              + Create Release
            </button>

          </form>
        </section>

        {/* RELEASE LIST */}
        <section className="releases-section">

          <div className="releases-heading">
            <div>
              <h2>Releases</h2>
              <p>
                {data.releases.length}{" "}
                {data.releases.length === 1
                  ? "release"
                  : "releases"}
              </p>
            </div>
          </div>

          {data.releases.length === 0 && (
            <div className="empty-state">
              <h3>No releases yet</h3>
              <p>
                Create your first release using the form above.
              </p>
            </div>
          )}

          <div className="release-list">

            {data.releases.map((release) => {

              const completedCount =
                release.steps.filter(
                  (step) => step.completed
                ).length;

              const totalSteps = release.steps.length;

              const progress =
                totalSteps === 0
                  ? 0
                  : Math.round(
                    (completedCount / totalSteps) * 100
                  );

              return (
                <article
                  className="release-card"
                  key={release.id}
                >

                  {/* RELEASE HEADER */}
                  <div className="release-top">

                    <div>
                      <div className="title-row">
                        <h3>{release.name}</h3>

                        <span
                          className={`status ${release.status}`}
                        >
                          {release.status}
                        </span>
                      </div>

                      <p className="due-date">
                        Due:{" "}
                        {new Date(
                          release.date
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  {/* PROGRESS */}
                  <div className="progress-section">

                    <div className="progress-header">
                      <span>Checklist progress</span>

                      <strong>
                        {completedCount}/{totalSteps}
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <span className="progress-text">
                      {progress}% completed
                    </span>

                  </div>

                  {/* INFO */}
                  {release.additionalInfo && (
                    <div className="info-box">
                      <span>Release information</span>
                      <p>{release.additionalInfo}</p>
                    </div>
                  )}

                  {/* CHECKLIST */}
                  <div className="checklist">

                    {release.steps.map((step) => (
                      <label
                        className={`check-item ${step.completed
                          ? "completed"
                          : ""
                          }`}
                        key={step.id}
                      >
                        <input
                          type="checkbox"
                          checked={step.completed}
                          onChange={(e) =>
                            toggle(
                              release.id,
                              step.id,
                              e.target.checked
                            )
                          }
                        />

                        <span>{step.name}</span>
                      </label>
                    ))}

                  </div>

                  {/* ACTIONS */}
                  <div className="release-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editInfo(release)
                      }
                    >
                      Edit Info
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        remove(release.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        </section>

      </main>
    </div>
  );
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://release-checklist-362i.onrender.com/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function Root() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}