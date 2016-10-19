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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var connection_1 = require('../../services/connection');
var myService_1 = require('../../services/myService');
var room_service_1 = require('../../services/room.service');
var login_service_1 = require('../../services/login.service');
var participant_component_1 = require('../participant/participant.component');
var userFactory_1 = require('../../services/userFactory');
var room_html_1 = require('./room.html');
var RoomComponent = (function () {
    function RoomComponent(room, login, router, connection, appService, route) {
        this.room = room;
        this.login = login;
        this.router = router;
        this.connection = connection;
        this.appService = appService;
        this.route = route;
        console.log("");
        console.log("% Room constructor " + new Date().toLocaleTimeString());
        this.users = [];
        console.log(this.users);
        console.log("/ Room constructor " + new Date().toLocaleTimeString());
        console.log("");
    }
    RoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.name = params['roomName'];
        });
        this.address = this.name;
        // this.room.init(this.name);
        this.onParticipantLessSubscription = this.connection.subscriptions.subscribeToParticipantLess(this, this.onRemoveParticipant);
        this.onParticipantInRoomSubscription = this.connection.subscriptions.subscribeToParticipantInRoom(this, this.onAddParticipant);
        this.onVideoResponseSubscription = this.connection.subscriptions.subscribeToVideoAnswer(this, this.onReceiveVideoResponse);
        this.onIceCandidateSubscription = this.connection.subscriptions.subscribeToIceCandidate(this, this.onAddIceCandidate);
        this.lookingForParticipants();
    };
    RoomComponent.prototype.lookingForParticipants = function () {
        console.log("");
        console.log("* Room.lookingForParticipants " + new Date().toLocaleTimeString());
        var jsonMessage = {
            id: "joinRoom",
            roomName: this.name,
            userName: this.appService.myUserName,
            userType: this.appService.myUserType,
            name: this.appService.myName
        };
        this.connection.sendMessage(jsonMessage);
        console.log(this.users);
        console.log("/ Room.lookingForParticipants " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.onAddParticipant = function (jsonMessage) {
        console.log("");
        console.log("* <- Room.onAddParticipant " + new Date().toLocaleTimeString());
        console.log("<- message: " + JSON.stringify(jsonMessage));
        console.log(this.users);
        var user;
        // My video will be the last 
        if (jsonMessage.userName === this.appService.myUserName) {
            user = this.appService.getMe();
            this.users.push(user);
            console.log("It's me");
        }
        else {
            user = userFactory_1.UserFactory.createAnUser(jsonMessage);
            console.log("A new participant created");
            if (user.isATutor() || (this.appService.amATutor && !this.mainUser)) {
                this.mainUser = user;
            }
            else {
                this.users.splice(this.users.length - 1, 0, user);
            }
        }
        console.log(this.users);
        console.log("/ Room.onAddParticipant " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.onReceiveVideoResponse = function (jsonMessage) {
        console.log("");
        console.log("<- Room.onReceiveVideoResponse " + new Date().toLocaleTimeString());
        console.log("<- message: " + JSON.stringify(jsonMessage));
        var userName = jsonMessage.userName;
        var sdpAnswer = jsonMessage.sdpAnswer;
        var participant = this.getParticipant(userName);
        console.log("participant:");
        console.log(participant);
        participant.receiveVideoResponse(sdpAnswer);
        console.log("/ Room.onReceiveVideoResponse " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.onAddIceCandidate = function (jsonMessage) {
        console.log("");
        console.log("<- Room.onIceCandidate " + new Date().toLocaleTimeString());
        console.log("<- message: " + JSON.stringify(jsonMessage));
        var userName = jsonMessage.userName;
        var candidate = jsonMessage.candidate;
        var participant = this.getParticipant(userName);
        console.log("participant:");
        console.log(participant);
        participant.addIceCandidate(candidate);
        console.log("/ Room.onIceCandidate");
        console.log("/ " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.onRemoveParticipant = function (jsonMessage) {
        console.log("");
        console.log("<- Room.onRemoveParticipant - name: " + jsonMessage.userName + " " + new Date().toLocaleTimeString());
        console.log("<- message: " + JSON.stringify(jsonMessage));
        this.removeParticipantComponent(jsonMessage.userName);
        console.log("/ Room.onRemoveParticipant ${new Date().toLocaleTimeString()}");
        console.log("");
    };
    RoomComponent.prototype.removeParticipantComponent = function (userName) {
        console.log("");
        console.log("* Room.removeParticipantComponent: " + userName + " " + new Date().toLocaleTimeString());
        this.closeParticipant(userName);
        this.deleteUser(userName);
        console.log("/ Room.removeParticipantComponent " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.closeParticipant = function (userName) {
        console.log("");
        console.log("* Room.closeParticipant: " + userName + " " + new Date().toLocaleTimeString());
        var participant = this.getParticipant(userName);
        participant.dispose();
        console.log("/ Room.closeParticipant " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.getParticipant = function (userName) {
        console.log("");
        console.log("* Room.getParticipant: " + userName + " of ...  " + new Date().toLocaleTimeString());
        console.log(this.users);
        var participant;
        if (this.mainParticipant && this.mainParticipant.userName === userName) {
            participant = this.mainParticipant;
        }
        else {
            participant = this.participants._results.filter(function (participant) { return participant.id === userName; })[0];
        }
        console.log("/ Room.getParticipant -> " + participant.userName + " " + new Date().toLocaleTimeString());
        console.log("");
        return participant;
    };
    RoomComponent.prototype.deleteUser = function (userName) {
        console.log("");
        console.log("* Room.deleteUser: " + userName + " " + new Date().toLocaleTimeString());
        console.log("users before: " + JSON.stringify(this.users));
        if (this.mainUser && this.mainUser.userName === userName) {
            this.mainUser = null;
        }
        else {
            var index = this.getIndexOfUser(userName);
            this.users.splice(index, 1);
        }
        console.log("users after: " + JSON.stringify(this.users));
        console.log("/ Room.deleteUser " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.getIndexOfUser = function (userName) {
        var index = 0;
        var i = index;
        var length = this.users.length;
        var found = false;
        while (!found && i < length) {
            if (this.users[i].userName === userName) {
                found = true;
                index = i;
            }
            else {
                i++;
            }
        }
        if (!found) {
            index = length;
        }
        return index;
    };
    RoomComponent.prototype.onExitOfRoom = function () {
        console.log("");
        console.log("<- Room.onExitOfRoom: " + this.name + " " + new Date().toLocaleTimeString());
        var jsonMessage = {
            id: "exitRoom",
            roomName: this.name,
            userName: this.appService.myUserName,
            userType: this.appService.myUserType,
        };
        this.connection.sendMessage(jsonMessage);
        this.removeAllParticipants();
        if (this.appService.amAStudent()) {
            this.router.navigate(['/rooms']);
        }
        else {
            this.router.navigate(['/login']);
        }
        console.log("/ Room.onExitOfRoom " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.removeAllParticipants = function () {
        console.log("");
        console.log("* Room.removeAllParticipants " + new Date().toLocaleTimeString());
        if (this.mainParticipant) {
            this.mainParticipant.dispose();
            this.mainParticipant = null;
        }
        this.participants._results.map(function (participant) { return participant.dispose(); });
        this.users.length = 0;
        console.log("/ Room.removeAllParticipants " + new Date().toLocaleTimeString());
        console.log("");
    };
    RoomComponent.prototype.ngOnDestroy = function () {
        console.log("* Room.OnDestroy " + new Date().toLocaleTimeString());
        this.onParticipantLessSubscription.unsubscribe();
        this.onParticipantInRoomSubscription.unsubscribe();
        this.onVideoResponseSubscription.unsubscribe();
        this.onIceCandidateSubscription.unsubscribe();
        //this.room.destroy();
    };
    __decorate([
        core_1.ViewChild(participant_component_1.ParticipantComponent), 
        __metadata('design:type', participant_component_1.ParticipantComponent)
    ], RoomComponent.prototype, "mainParticipant", void 0);
    __decorate([
        core_1.ViewChildren(participant_component_1.ParticipantComponent), 
        __metadata('design:type', core_1.QueryList)
    ], RoomComponent.prototype, "participants", void 0);
    RoomComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ovt-room',
            styleUrls: ["room.css"],
            template: room_html_1.roomTemplate,
            providers: [room_service_1.RoomService, login_service_1.LoginService]
        }), 
        __metadata('design:paramtypes', [room_service_1.RoomService, login_service_1.LoginService, router_1.Router, connection_1.Connection, myService_1.MyService, router_1.ActivatedRoute])
    ], RoomComponent);
    return RoomComponent;
}());
exports.RoomComponent = RoomComponent;
//# sourceMappingURL=room.component.js.map
