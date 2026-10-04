/**
 * Interactive SVG Network Diagram Controller
 * Handles mouse interactions on network nodes and dynamically
 * updates the container inspector panel with relevant vulnerability
 * descriptions and mitigations.
 */

document.addEventListener("DOMContentLoaded", () => {
    const nodes = document.querySelectorAll(".svg-node");
    const placeholder = document.getElementById("details-placeholder");
    const detailPanels = document.querySelectorAll(".active-detail");

    if (nodes.length > 0) {
        // Helper to activate a specific node/panel
        function activateNode(targetId) {
            // 1. Remove active class from all SVG nodes
            nodes.forEach(node => {
                node.classList.remove("active");
                node.setAttribute("aria-selected", "false");
            });

            // 2. Hide placeholder
            if (placeholder) {
                placeholder.style.display = "none";
            }

            // 3. Hide all detail panels
            detailPanels.forEach(panel => {
                panel.classList.remove("show");
            });

            // 4. Find and show target panel
            const targetPanel = document.getElementById(`detail-${targetId}`);
            const targetNode = document.getElementById(targetId);

            if (targetPanel && targetNode) {
                targetNode.classList.add("active");
                targetNode.setAttribute("aria-selected", "true");
                targetPanel.classList.add("show");
            }
        }

        // Add event listeners to all SVG nodes
        nodes.forEach(node => {
            node.addEventListener("click", () => {
                const targetId = node.getAttribute("id");
                activateNode(targetId);
            });

            node.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const targetId = node.getAttribute("id");
                    activateNode(targetId);
                }
            });
        });

        // Automatically pre-select Docker Compose on load for a dynamic presentation
        setTimeout(() => {
            activateNode("node-compose");
        }, 300);
    }
});
