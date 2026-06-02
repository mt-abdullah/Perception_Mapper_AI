"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let TelemetryGateway = class TelemetryGateway {
    handleConnection(client) {
        client.emit("status", { connected: true, timestamp: new Date().toISOString() });
    }
    handleDisconnect(client) {
    }
    handlePing(client) {
        return "pong";
    }
    async handleRealtimeAnalyze(client, data) {
        if (!data || !data.text || !data.text.trim()) {
            client.emit("analysis_result", { success: false, error: "Text must not be empty" });
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: data.text }),
            });
            if (!response.ok) {
                throw new Error(`NLP Engine returned status ${response.status}`);
            }
            const result = await response.json();
            client.emit("analysis_result", {
                success: true,
                source: "WebSocket Live Stream",
                ...result,
            });
        }
        catch (err) {
            client.emit("analysis_result", {
                success: false,
                source: "WebSocket Mock Fallback",
                message: "Python NLP sidecar offline. Returning baseline assessment.",
                language: "English",
                scores: {
                    sentiment: 50,
                    objectivity: 80,
                    biasIndex: 10,
                },
                tones: [
                    { name: "Informative", score: 70, color: "from-blue-500 to-indigo-500" },
                ],
                biases: [],
            });
        }
    }
    broadcastTelemetry(event, data) {
        if (this.server) {
            this.server.emit(event, {
                ...data,
                timestamp: new Date().toISOString(),
            });
        }
    }
};
exports.TelemetryGateway = TelemetryGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TelemetryGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("ping"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", String)
], TelemetryGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("analyze"),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TelemetryGateway.prototype, "handleRealtimeAnalyze", null);
exports.TelemetryGateway = TelemetryGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
        namespace: "telemetry",
    })
], TelemetryGateway);
//# sourceMappingURL=telemetry.gateway.js.map