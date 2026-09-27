const STEPS = [
    "Code review completed",
    "Tests passing",
    "Build generated",
    "Database migrations checked",
    "Environment variables verified",
    "Security checks completed",
    "Documentation updated",
    "Deployment completed",
];

function getStatus(completedSteps) {
    if (completedSteps.length === 0) return "planned";
    if (completedSteps.length === STEPS.length) return "done";
    return "ongoing";
}

module.exports = { STEPS, getStatus };