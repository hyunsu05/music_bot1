"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function runJava() {
    return new Promise((resolve, reject) => {
        const javaCommand = "java";
        const args = ["-jar", "Lavalink/Lavalink.jar", "-Xmx512M"];
        const javaProcess = (0, child_process_1.spawn)(javaCommand, args);
        const timeout = 5000; // 5초 타임아웃
        let stdoutData = "";
        let timer = setTimeout(() => {
            // 특정 함수 실행 (예: 오류 처리 함수)
            //   handleTimeout();
            Promise.resolve().then(() => __importStar(require("./index")));
        }, timeout);
        // 자식 프로세스의 stdout 이벤트를 청취하여 데이터 수집
        javaProcess.stdout.on("data", (data) => {
            stdoutData += data.toString();
            clearTimeout(timer);
            timer = setTimeout(() => {
                Promise.resolve().then(() => __importStar(require("./index")));
            }, timeout);
        });
    });
}
runJava();
