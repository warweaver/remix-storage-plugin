import { ProfileMap } from '@remixproject/plugin-utils';
import { ICompiler } from './compiler';
import { IFileSystem } from './file-system/file-manager';
import { IEditor } from './editor';
import { INetwork } from './network';
import { IUdapp } from './udapp';
import { ITheme } from './theme';
import { IUnitTesting } from './unit-testing';
import { IContentImport } from './content-import';
import { ISettings } from './settings';
import { IPluginManager } from './plugin-manager';
import { IFileExplorer } from './file-system/file-explorers';
import { IDgitSystem } from './dgit';
export interface IRemixApi {
    manager: IPluginManager;
    solidity: ICompiler;
    fileManager: IFileSystem;
    fileExplorers: IFileExplorer;
    dGitProvider: IDgitSystem;
    solidityUnitTesting: IUnitTesting;
    editor: IEditor;
    network: INetwork;
    udapp: IUdapp;
    contentImport: IContentImport;
    settings: ISettings;
    theme: ITheme;
}
export declare type RemixApi = Readonly<IRemixApi>;
/** @deprecated Use remixProfiles instead. Will be remove in next version */
export declare const remixApi: ProfileMap<RemixApi>;
/** Profiles of all the remix's Native Plugins */
export declare const remixProfiles: ProfileMap<RemixApi>;
