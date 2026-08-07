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
                targetPanel.classList.add("show");
            }
        }

        // Add event listeners to all SVG nodes
        nodes.forEach(node => {
            node.addEventListener("click", () => {
                const targetId = node.getAttribute("id");
                activateNode(targetId);
            });
        });

        // OPTIONAL: Automatically pre-select Nginx Gateway on load for dynamic presentation
        // We do this after a small delay to allow the entrance transition to look clean
        setTimeout(() => {
            activateNode("node-proxy");
        }, 300);
    }
});
