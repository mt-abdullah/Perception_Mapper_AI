import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
export declare class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handlePing(client: Socket): string;
    handleRealtimeAnalyze(client: Socket, data: {
        text: string;
    }): Promise<void>;
    broadcastTelemetry(event: string, data: any): void;
}
