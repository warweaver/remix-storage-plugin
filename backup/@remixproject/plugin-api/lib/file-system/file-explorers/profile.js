"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExplorerProfile = void 0;
exports.fileExplorerProfile = {
    name: "fileExplorers",
    displayName: "File explorers",
    description: "Provides communication between remix file explorers and remix-plugin",
    location: "sidePanel",
    documentation: "",
    version: "0.0.1",
    methods: ['getCurrentWorkspace', 'getWorkspaces', 'createWorkspace', 'renameWorkspace'],
    events: ['setWorkspace', 'renameWorkspace', 'deleteWorkspace', 'createWorkspace']
};
//# sourceMappingURL=profile.js.map