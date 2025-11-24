import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import http from "http";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { setupWebSocket } from "./websocket";
import authRoutes from "./modules/auth/auth.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import shopRouter from "./modules/shop/shop.routes";

// **CORREÇÃO:** Render.com usa process.env.PORT
const PORT = process.env.PORT || "8080";

const app: Express = express();
const server = http.createServer(app);

const corsConfig = {
	origin: "*",
	credentials: false,
};

app.use(cors(corsConfig))
	.use(express.json())
	.use(express.urlencoded({ extended: false }))
	.use((req: Request, _: Response, next) => {
		console.log(req.path, req.method);
		next();
	});

// Routes
app.get("/", (_: Request, res: Response) => {
	res.send({ message: "hello world!" });
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Outros routers
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);
app.use("/shop", shopRouter);

// WebSocket setup (Render sempre expõe como WSS!)
setupWebSocket(server);

// **CORREÇÃO:** Listen na porta correta para Render.com
server.listen(PORT, () => {
	console.log(`[Server] Ready > The server is running on 0.0.0.0:${PORT}`);
});
