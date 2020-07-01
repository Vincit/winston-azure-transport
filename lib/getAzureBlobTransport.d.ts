import { AzureBlobTransport, IAzureBlobTransportOptions } from "./AzureBlobTransport";
export interface IAzureBlobTransportAppSettings {
    [key: string]: string | number;
}
export declare function getAzureBlobTransport(config?: Partial<IAzureBlobTransportOptions>, appSettings?: IAzureBlobTransportAppSettings): AzureBlobTransport | null;
