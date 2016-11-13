/**
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
 * 
 */

import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';

import { LoadingComponent } from '../loading/loading.component';

import { ParticipantsService } from '../../services/participants.service';
import { UserService } from '../../services/user.service';

import { participantComponentTemplate } from './participant.html'

type RtcPeerOptions = { mediaConstraints: Object, onicecandidate: any, localVideo: HTMLElement, remoteVideo: HTMLElement };


@Component({
    moduleId: module.id,
    selector: 'ovt-participant',
    styleUrls: ["participant.css"],
    template: participantComponentTemplate,
})

export class ParticipantComponent implements OnInit{

    @ViewChild('video') video : ElementRef;
    @Input() id : string;
    @Input() class : string;
    @Input() name : string;
    @Input() userType : string;
    @Input() roomName : string;
    
    private loading: boolean;
    private participantUserName: string;
    private important: boolean;

    private constraints: Object;
    private options: RtcPeerOptions;
    private _rtcPeer: any;
   
    
    constructor(private participants: ParticipantsService, private me: UserService) {


        console.log("");
        console.log(`% Participant constructor ${new Date().toLocaleTimeString()}`);
        
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
        
        console.log(`/ Participant constructor ${new Date().toLocaleTimeString()}`);
        console.log("");
    }

    ngOnInit() { 
        //console.log(`Participant.onInit - userType: ${this.userType}`);
        this.participantUserName = this.id;
        this.createRtcPeer();
        this.participants.attachParticipant(this.participantUserName, this.processAnswer(), this.addIceCandidate());
    }

    private createRtcPeer(): void {

        var _participant: ParticipantComponent = this;
        var _options: RtcPeerOptions = this.options;
        _options.onicecandidate = _participant.onIceCandidate.bind(_participant);
//   console.log("# {onicecandidate: participant.onIceCandidate.bind(participant)}");

        // It is me
        if (this.me.myUserName === this.participantUserName) {

           _options.localVideo = this.video.nativeElement;

            //  console.log("video:");
            //console.log(this.video.nativeElement);

            _options.mediaConstraints = this.constraints;

            //  console.log("@ creating rtcPeer");
            this._rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(_options,
                function(error) {
                    if (error) {
                        return console.error(error);
                    }
                    this.generateOffer(_participant.offerToReceiveVideo.bind(_participant));
                });
            //   console.log(this._rtcPeer);    
            // console.log("# created rtcPeer");
        }

        else {

            _options.remoteVideo = this.video.nativeElement;
            // console.log("@ creating rtcPeer");
            this._rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(_options,
                function(error) {
                    if (error) {
                        return console.error(error);
                    }
                    this.generateOffer(_participant.offerToReceiveVideo.bind(_participant));
                });
            // console.log(this._rtcPeer);    
            //console.log("# creating rtcPeer");
        }
        // console.log("constraints: " + JSON.stringify(this.constraints));
        //console.log("options: " + JSON.stringify(this.options));
        // console.log(`I'm ${this._userName} with ${this._rtcPeer}`);
        console.log(`/ Participant.afterViewInit ${new Date().toLocaleTimeString()}`);
        console.log("");
    }    

    offerToReceiveVideo(error: any, offerSdp: any, wp: any): void {
        console.log("");
        console.log(`***-> ParticipantComponent.offerToReceiveVideo  ${this.participantUserName} ${new Date().toLocaleTimeString()}`);
        
        this.participants.offerToReceiveVideo(this.participantUserName, this.roomName, offerSdp);
        

        console.log(`/ ParticipantComponent.offerToReceiveVideo ${new Date().toLocaleTimeString()}`);
        console.log("");
    }

    onIceCandidate(candidate: any, wp: any): void {
        // console.log("");
        // console.log(`* -> Participant.onIceCandidtae - Local candidate: ${JSON.stringify(candidate)} ${new Date().toLocaleTimeString()}`);

        this.participants.onIceCandidate(this.participantUserName, this.roomName, candidate);
       
        // console.log(`/ Local candidate ${new Date().toLocaleTimeString()}`);
        //console.log("");

    }

    processAnswer(): (sdpAnswer: any) => any {
        console.log("");
        console.log(`*** ParticipantComponent.getProcessAnswer ${this.me.myUserName} ${new Date().toLocaleTimeString()}`);
        
       this.loading = false; 
       return (
            (sdpAnswer: any):any => {
                console.log(`*** ParticipantComponent.processAnswer ${new Date().toLocaleTimeString()}`);
                this._rtcPeer.processAnswer(sdpAnswer, function(error) {
                    if (error) {
                        console.error(`!! ERROR:Participant.receiveVideoResponse`);
                        console.error(error);
                        return;
                    }
            });        
        });
        
    }

    addIceCandidate(): (candidate: any) => any {
        // console.log("");
        //  console.log(`* Participant.getAddIceCandidate  ${new Date().toLocaleTimeString()}`);
        // console.log("");

        return (
            (candidate: any): any => {
                this._rtcPeer.addIceCandidate(candidate, function(error) {
                    if (error) {
                        console.error(`!! ERROR:Participant.addIceCandidate`);
                        console.error(error);
                        return;
                    }
             });    
        });
    }

    private dispose(): void {
        console.log("");
        console.log(`* ParticipantComponent.dispose I'm ${this.participantUserName} and i'm disposed ${new Date().toLocaleTimeString()}`);

        this._rtcPeer.dispose();

        console.log(`/ ParticipantComponent.dispose I'm ${this.participantUserName}} and i'm disposed ${new Date().toLocaleTimeString()}`);
        console.log("");
    }

    get userName():string{
        return this.participantUserName;
    }

    setClasses(){
        let classes = {
            'important': this.important,
        };
        return classes;
    }

    ngOnDestroy() {
        console.log(`* Participant(${this.participantUserName}).onDestroy ${new Date().toLocaleTimeString()}`);
        this.dispose();
        this.participants.detachParticipant(this.participantUserName);
    }

     
}