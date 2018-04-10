/**
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
 *
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var chatMessage_html_1 = require("./chatMessage.html");
var ChatMessageComponent = (function () {
    function ChatMessageComponent() {
        console.log("");
        console.log("% Message constructor " + new Date().toLocaleTimeString());
    }
    return ChatMessageComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ChatMessageComponent.prototype, "sender", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ChatMessageComponent.prototype, "message", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ChatMessageComponent.prototype, "date", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ChatMessageComponent.prototype, "color", void 0);
ChatMessageComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ovt-chatmessage',
        styleUrls: ["chatMessage.css"],
        template: chatMessage_html_1.chatMessageTemplate
    }),
    __metadata("design:paramtypes", [])
], ChatMessageComponent);
exports.ChatMessageComponent = ChatMessageComponent;
//# sourceMappingURL=chatMessage.component.js.map