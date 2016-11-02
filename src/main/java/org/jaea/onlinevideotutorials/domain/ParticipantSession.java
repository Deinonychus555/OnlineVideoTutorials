/*
 * (C) Copyright 2015 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */
package org.jaea.onlinevideotutorials.domain;

import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.logging.Level;
import org.jaea.onlinevideotutorials.Hour;
import org.jaea.onlinevideotutorials.Info;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.web.socket.WebSocketSession;


public class ParticipantSession  extends UserSession{
    
    private TutorialMedia tutorialMedia; 
    
   
    public ParticipantSession(WebSocketSession session, String userName, String userType, String name){
        super(session, userName, userType, name);
    
    }
    
    public ParticipantSession(WebSocketSession session, User user){
        super(session, user);
    
    }
    
    public ParticipantSession(UserSession user){
        super(user);
    }
    
    public void assignRoomMedia (TutorialMedia tutorialMedia){
        Info.logInfoStart("* Participant.assignRoomMedia: " + this.getUserName());
        
        this.tutorialMedia = tutorialMedia;
        
        Info.logInfoFinish("/ User.assignRoomMedia");
    }
    
    public void addAddress (JsonObject address, ParticipantSession participant) {
       // Info.logInfoStart("* Participant.addAddress: " + participant.getUserName());
        
        this.tutorialMedia.addCandidate(address, participant);
       // Info.logInfoStart("/ Participant.addAddress: " + participant.getUserName());
    }
    
    public String receivesGreetingsFrom(ParticipantSession participant, String offer){
        log.info("{} Participant.receivesGreetingsFrom {} from {}", this.getUserName(), participant.getUserName(), Hour.getTime());
        
        String sdpAnswer = null;
        try {
            sdpAnswer = this.tutorialMedia.receiveVideoFrom(participant, offer);
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(ParticipantSession.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        Info.logInfoFinish("Participant.receivesGreetingsFrom");
        return sdpAnswer;
    }
    
    public void connectToRemote(WebRtcEndpoint incomingMedia) {
        this.tutorialMedia.connectToRemote(incomingMedia);
    }
    
    public void receivesFarewellFrom(String userName){
        log.info("{} Participant.receivesFarewellFrom: {} from {} {}",Info.START_SYMBOL, this.getUserName(), userName, Hour.getTime());
        
        this.tutorialMedia.cancelVideoFrom(userName);
        
        Info.logInfoFinish("Participant.receivesFarewellFrom");
    }
    
    public void leavesRoom(){
        
        log.info("{} Participant.leavesRoom: {} - {}", Info.START_SYMBOL, this.getUserName(), Hour.getTime());
        try {
            this.tutorialMedia.close();
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(ParticipantSession.class.getName()).log(Level.SEVERE, null, ex);
        
        }
        Info.logInfoFinish("Participant.leavesRoom");
    }
    
}
