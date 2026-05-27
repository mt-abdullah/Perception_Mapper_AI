import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "telemetry",
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit("status", { connected: true, timestamp: new Date().toISOString() });
  }

  handleDisconnect(client: Socket) {
    // Graceful disconnect cleanup
  }

  @SubscribeMessage("ping")
  handlePing(client: Socket): string {
    return "pong";
  }

  // Broadcaster for real-time audit updates
  broadcastTelemetry(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
