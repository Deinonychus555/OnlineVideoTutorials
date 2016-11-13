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
var participants_service_1 = require('../../services/participants.service');
var user_service_1 = require('../../services/user.service');
var participant_html_1 = require('./participant.html');
var ParticipantComponent = (function () {
    function ParticipantComponent(participants, me) {
        this.participants = participants;
        this.me = me;
        console.log("");
        console.log("% Participant constructor " + new Date().toLocaleTimeString());
        this.important = false;
        this.options = { mediaConstraints: null, onicecandidate: null, localVideo: null, remoteVideo: null };
        this.constraints = {
            audio: true,
            video: {
                mandatory: {
                    maxFrameRate: 15,
                    minFrameRate: 15
                }
            }
        };
        console.log("/ Participant constructor " + new Date().toLocaleTimeString());
        console.log("");
    }
    ParticipantComponent.prototype.ngOnInit = function () {
        //console.log(`Participant.onInit - userType: ${this.userType}`);
        this.participantUserName = this.id;
        this.createRtcPeer();
        this.participants.attachParticipant(this.participantUserName, this.processAnswer(), this.addIceCandidate());
    };
    ParticipantComponent.prototype.createRtcPeer = function () {
        var _participant = this;
        var _options = this.options;
        _options.onicecandidate = _participant.onIceCandidate.bind(_participant);
        //   console.log("# {onicecandidate: participant.onIceCandidate.bind(participant)}");
        // It is me
        if (this.me.myUserName === this.participantUserName) {
            _options.localVideo = this.video.nativeElement;
            //  console.log("video:");
            //console.log(this.video.nativeElement);
            _options.mediaConstraints = this.constraints;
            //  console.log("@ creating rtcPeer");
            this._rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(_options, function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(_participant.offerToReceiveVideo.bind(_participant));
            });
        }
        else {
            _options.remoteVideo = this.video.nativeElement;
            // console.log("@ creating rtcPeer");
            this._rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(_options, function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(_participant.offerToReceiveVideo.bind(_participant));
            });
        }
        // console.log("constraints: " + JSON.stringify(this.constraints));
        //console.log("options: " + JSON.stringify(this.options));
        // console.log(`I'm ${this._userName} with ${this._rtcPeer}`);
        console.log("/ Participant.afterViewInit " + new Date().toLocaleTimeString());
        console.log("");
    };
    ParticipantComponent.prototype.offerToReceiveVideo = function (error, offerSdp, wp) {
        console.log("");
        console.log("***-> ParticipantComponent.offerToReceiveVideo  " + this.participantUserName + " " + new Date().toLocaleTimeString());
        this.participants.offerToReceiveVideo(this.participantUserName, this.roomName, offerSdp);
        console.log("/ ParticipantComponent.offerToReceiveVideo " + new Date().toLocaleTimeString());
        console.log("");
    };
    ParticipantComponent.prototype.onIceCandidate = function (candidate, wp) {
        // console.log("");
        // console.log(`* -> Participant.onIceCandidtae - Local candidate: ${JSON.stringify(candidate)} ${new Date().toLocaleTimeString()}`);
        this.participants.onIceCandidate(this.participantUserName, this.roomName, candidate);
        // console.log(`/ Local candidate ${new Date().toLocaleTimeString()}`);
        //console.log("");
    };
    ParticipantComponent.prototype.processAnswer = function () {
        var _this = this;
        console.log("");
        console.log("*** ParticipantComponent.getProcessAnswer " + this.me.myUserName + " " + new Date().toLocaleTimeString());
        this.loading = false;
        return (function (sdpAnswer) {
            console.log("*** ParticipantComponent.processAnswer " + new Date().toLocaleTimeString());
            _this._rtcPeer.processAnswer(sdpAnswer, function (error) {
                if (error) {
                    console.error("!! ERROR:Participant.receiveVideoResponse");
                    console.error(error);
                    return;
                }
            });
        });
    };
    ParticipantComponent.prototype.addIceCandidate = function () {
        // console.log("");
        //  console.log(`* Participant.getAddIceCandidate  ${new Date().toLocaleTimeString()}`);
        // console.log("");
        var _this = this;
        return (function (candidate) {
            _this._rtcPeer.addIceCandidate(candidate, function (error) {
                if (error) {
                    console.error("!! ERROR:Participant.addIceCandidate");
                    console.error(error);
                    return;
                }
            });
        });
    };
    ParticipantComponent.prototype.dispose = function () {
        console.log("");
        console.log("* ParticipantComponent.dispose I'm " + this.participantUserName + " and i'm disposed " + new Date().toLocaleTimeString());
        this._rtcPeer.dispose();
        console.log("/ ParticipantComponent.dispose I'm " + this.participantUserName + "} and i'm disposed " + new Date().toLocaleTimeString());
        console.log("");
    };
    Object.defineProperty(ParticipantComponent.prototype, "userName", {
        get: function () {
            return this.participantUserName;
        },
        enumerable: true,
        configurable: true
    });
    ParticipantComponent.prototype.setClasses = function () {
        var classes = {
            'important': this.important,
        };
        return classes;
    };
    ParticipantComponent.prototype.ngOnDestroy = function () {
        console.log("* Participant(" + this.participantUserName + ").onDestroy " + new Date().toLocaleTimeString());
        this.dispose();
        this.participants.detachParticipant(this.participantUserName);
    };
    __decorate([
        core_1.ViewChild('video'), 
        __metadata('design:type', core_1.ElementRef)
    ], ParticipantComponent.prototype, "video", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ParticipantComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ParticipantComponent.prototype, "class", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ParticipantComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ParticipantComponent.prototype, "userType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ParticipantComponent.prototype, "roomName", void 0);
    ParticipantComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ovt-participant',
            styleUrls: ["participant.css"],
            template: participant_html_1.participantComponentTemplate,
        }), 
        __metadata('design:paramtypes', [participants_service_1.ParticipantsService, user_service_1.UserService])
    ], ParticipantComponent);
    return ParticipantComponent;
}());
exports.ParticipantComponent = ParticipantComponent;
//# sourceMappingURL=participant.component.js.map