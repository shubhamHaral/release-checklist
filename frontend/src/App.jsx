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
  const { data, loading, error, refetch } = useQuery(GET_RELEASES);

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
    });

    refetch();
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
    });

    refetch();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this release?")) return;

    await deleteRelease({
      variables: { id },
    });

    refetch();
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>Unable to connect to API.</p>;
  }

  return (
    <div className="container">
      <header>
        <h1>Release Checklist</h1>
        <p>Manage your software releases.</p>
      </header>

      <section className="card">
        <h2>Create Release</h2>

        <form onSubmit={create}>
          <input
            type="text"
            placeholder="Release name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <textarea
            placeholder="Additional information (optional)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />

          <button type="submit">Create Release</button>
        </form>
      </section>

      <section>
        <h2>Releases</h2>

        {data.releases.length === 0 && (
          <p>No releases yet.</p>
        )}

        {data.releases.map((release) => (
          <div className="release-card" key={release.id}>
            <div className="release-header">
              <div>
                <h3>{release.name}</h3>
                <p>
                  Due:{" "}
                  {new Date(release.date).toLocaleString()}
                </p>
              </div>

              <span className={`status ${release.status}`}>
                {release.status}
              </span>
            </div>

            {release.additionalInfo && (
              <p className="info">
                {release.additionalInfo}
              </p>
            )}

            <div className="steps">
              {release.steps.map((step) => (
                <label key={step.id}>
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

                  {step.name}
                </label>
              ))}
            </div>

            <div className="actions">
              <button
                onClick={() => editInfo(release)}
              >
                Edit Info
              </button>

              <button
                className="delete"
                onClick={() => remove(release.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
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