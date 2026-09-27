const { pool } = require("../../db/database");
const { STEPS, getStatus } = require("./status");



function formatRelease(row) {
    const completedSteps = row.completed_steps || [];

    return {
        id: row.id,
        name: row.name,
        date: row.date.toISOString(),
        status: getStatus(completedSteps),
        additionalInfo: row.additional_info,
        steps: STEPS.map((name, index) => ({
            id: index,
            name,
            completed: completedSteps.includes(index),
        })),
    };
}

const root = {
    releases: async () => {
        const result = await pool.query(
            "SELECT * FROM releases ORDER BY date ASC"
        );

        return result.rows.map(formatRelease);
    },

    release: async ({ id }) => {
        const result = await pool.query(
            "SELECT * FROM releases WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return formatRelease(result.rows[0]);
    },

    createRelease: async ({ name, date, additionalInfo }) => {
        const result = await pool.query(
            `INSERT INTO releases (name, date, additional_info)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [name, date, additionalInfo || null]
        );

        return formatRelease(result.rows[0]);
    },

    updateRelease: async ({ id, additionalInfo }) => {
        const result = await pool.query(
            `UPDATE releases
       SET additional_info = $1
       WHERE id = $2
       RETURNING *`,
            [additionalInfo || null, id]
        );

        if (result.rows.length === 0) {
            throw new Error("Release not found");
        }

        return formatRelease(result.rows[0]);
    },

    toggleStep: async ({ id, stepId, completed }) => {
        if (stepId < 0 || stepId >= STEPS.length) {
            throw new Error("Invalid step");
        }

        const result = await pool.query(
            "SELECT * FROM releases WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error("Release not found");
        }

        let completedSteps = result.rows[0].completed_steps || [];

        if (completed) {
            if (!completedSteps.includes(stepId)) {
                completedSteps.push(stepId);
            }
        } else {
            completedSteps = completedSteps.filter(
                (step) => step !== stepId
            );
        }

        const updated = await pool.query(
            `UPDATE releases
       SET completed_steps = $1
       WHERE id = $2
       RETURNING *`,
            [JSON.stringify(completedSteps), id]
        );

        return formatRelease(updated.rows[0]);
    },

    deleteRelease: async ({ id }) => {
        const result = await pool.query(
            "DELETE FROM releases WHERE id = $1",
            [id]
        );

        return result.rowCount > 0;
    },
};

module.exports = root;