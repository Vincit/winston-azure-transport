import { TransformableInfo } from "logform";
import TransportStream from "winston-transport";
export interface IAzureBlobTransportOptions extends TransportStream.TransportStreamOptions {
    containerUrl: string;
    name?: string;
    nameFormat?: string;
    syncDelay?: number;
    retention?: number;
    trace?: boolean;
}
export declare const DEFAULT_NAME_FORMAT = "{yyyy}/{MM}/{dd}/{hh}/node.log";
export declare const DEFAULT_SYNC_DELAY = 1000;
export declare class AzureBlobTransport extends TransportStream {
    name: string;
    private trace;
    private syncDelay;
    private cargo;
    private containerName;
    private nameFormat;
    private retention?;
    private blobService;
    constructor(opts: IAzureBlobTransportOptions);
    private debug;
    private createSas;
    log(info: TransformableInfo, callback: () => void): void;
    private getBlobName;
    private nextClean?;
    private parseName;
    private listBlobsCallback;
    private listBlobs;
    private deleteBlobComplete;
    private listBlobsComplete;
    private cleanOldLogs;
    private createBlockComplete;
    private writeBlockComplete;
    private writeBlock;
    private buildCargo;
    private chunk;
}
