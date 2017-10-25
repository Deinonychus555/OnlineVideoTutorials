/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
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

import org.jaea.onlinevideotutorials.Hour;
import org.jaea.onlinevideotutorials.Info;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.JsonObject;
import java.io.Closeable;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PreDestroy;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.EntityListeners;
import javax.persistence.Transient;
import org.kurento.client.Continuation;
import org.kurento.client.MediaPipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;



/**
 * Room
 * 
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
*/
@Entity
@Table(name="rooms")
@JsonIgnoreProperties(value={"log","createdAt","participantsByUserName", "pipeline"})
@EntityListeners(AuditingEntityListener.class)
public class Room implements Closeable {
    
    
    @Transient
    private final Logger log = LoggerFactory.getLogger(Room.class);

    @JsonIgnore
    @Id
    @GeneratedValue
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP) 
    @CreatedDate
    private Date createdAt;
    
    private String name = "";;

    //private ParticipantSession tutor = null;
    private String tutor = "";
    
    @Transient
    private List<ParticipantSession> participantsHistorial = new ArrayList<>();
    
    // The tutor is included in the participants
    @Transient
    private final ConcurrentHashMap<String, ParticipantSession> participantsByUserName = new ConcurrentHashMap<>();
    
    @Transient
    private MediaPipeline pipeline;
    
    private Room(){};
    
    public Room(String name, MediaPipeline pipeline) {
        log.info("% ROOM {}", Hour.getTime());
        this.name = name;
        this.pipeline = pipeline;
        
	log.info("/ ROOM {} has been created {}", this.name, Hour.getTime());
    }

    @JsonProperty 
    public Date getcreatedAt(){
        return this.createdAt;
    }
    
    public String getName() {
        return this.name;
    }

    public List<ParticipantSession> getParticipantsHistorial(){
        return this.participantsHistorial;
    }
    
    @JsonIgnore
    public boolean isEmpty(){
        return this.participantsByUserName.isEmpty();
    }

    public int getParticipantsNumber(){
        int participantsNumber = 0;
        if (this.participantsByUserName != null) {
            participantsNumber = this.participantsByUserName.size();
        }
        return participantsNumber;
    }
    
    public List<ParticipantSession> getParticipants() {
        return Collections.list(this.participantsByUserName.elements());
    }

    public ParticipantSession getParticipant(String userName) {
        return this.participantsByUserName.get(userName);
    }
/*
    public boolean isTheTutor(ParticipantSession user){
        log.info("* Room.isTheTutor?");
        return user.equals(this.tutor);
       
    }
  
    public boolean isTheTutor(String userName){
        log.info("* Room.isTheTutor?: {}", userName);
        log.info("Tutor: " + this.tutor.getUserName());
        String tutorUserName = null;
        boolean answer = false;
        if (this.tutor == null){
            log.info("The tutor is null");
            answer = false;
        }
        else {
            tutorUserName = this.tutor.getUserName();
            answer = tutorUserName.equals(userName);

        }
        
        log.info("/ Room.isTheTutor? The tutor is {}", tutorUserName);
        return answer;
    }
    */  
    public boolean isTheTutor(String userName){
        log.info("* Room.isTheTutor?: {}", userName);
        log.info("Tutor: " + this.tutor);
        return this.tutor.equals(userName);
    }

    public void addParticipant(ParticipantSession user) {
        log.info("{} ROOM.addParticipant {} to {} {}", Info.START_SYMBOL, user.getUserName(), this.name, Hour.getTime());
        Info.logInfoStart2("assignRoomMedia");
        
        this.addParticipantToHistorial(user);
        user.assignRoomMedia(new TutorialMedia(this.pipeline, user.getSession(), user.getUserName())); 
	    this.checkIfTheUserIsATutor(user);
        Info.logInfoFinish2("assignRoomMedia");
        
        this.participantsByUserName.put(user.getUserName(), user);
               
        this.printTheRoomParticipants(); //*
        log.info(participantsByUserName.keys().toString());
        log.info("{} ROOM.addParticipant {}", Info.FINISH_SYMBOL, Hour.getTime());
    }

    private void addParticipantToHistorial(ParticipantSession participant){
     
        if (!this.participantsHistorial.contains(participant)){
            this.participantsHistorial.add(participant);
        }
    }

    private void checkIfTheUserIsATutor(ParticipantSession user){
        if (this.tutor.equals("") && user.isATutor() ) {
            this.tutor = user.getUserName();
        }
    }
    
    public ParticipantSession leave(String userName) {
        log.info("{} Room.leave - PARTICIPANT {}: Leaving room {} {}", Info.START_SYMBOL, userName, this.name, Hour.getTime());
        
        ParticipantSession participant = participantsByUserName.remove(userName);
        
        if (participant != null) {
            log.info("-----------------------------------------------");//*
            log.info("I'M GOING TO CLOSE THEM");//*

            participant.leavesRoom();
            
            log.info("-----------------------------------------------");//*
            log.info("-----------------------------------------------");//*
            log.info("THEY'RE GOING TO CLOSE ME");//*
            
            /*
            if (this.isTheTutor(participant.getUserName())){
                this.tutor = "";
            }
            */
        }  
        
        this.printTheRoomParticipants();//*
        log.info("{} Room.leave {}", Info.FINISH_SYMBOL, Hour.getTime());
        
        return participant;
    }
    
    @PreDestroy
    public void shutdown() {
        Info.logInfoStart("Room.shutdown");
        this.close();
        Info.logInfoFinish("Room.shutdown");
    }

    @Override
    public void close() {
        Info.logInfoStart("Room.close");
        this.printTheRoomParticipants(); //*    
        for (final ParticipantSession participant : this.participantsByUserName.values()) {
            participant.leavesRoom();
        }

        this.participantsByUserName.clear();

        this.pipeline.release(new Continuation<Void>() {

            @Override
            public void onSuccess(Void result) throws Exception {
                log.trace("ROOM {}: Released Pipeline", Room.this.name);
            }

            @Override
            public void onError(Throwable cause) throws Exception {
                log.warn("PARTICIPANT {}: Could not release Pipeline",
                    Room.this.name);
            }
	});

            log.debug("{} Room {} closed",Info.FINISH_SYMBOL, this.name);
            Info.logInfoFinish();
	}
    
    public String manageOfferVideo(String addresseeUserName, String senderUserName, String offer){
        log.info("* Room.manageOfferVideo -> {} <- {}: {}", addresseeUserName, senderUserName);
        
        ParticipantSession addressee = this.getParticipant(addresseeUserName);
        ParticipantSession sender = this.getParticipant(senderUserName);
        
        String sdpAnswer = null;
        if ((addressee != null) && (sender != null)){
            sdpAnswer = addressee.receivesGreetingsFrom(sender, offer);
        }
        else {
            log.error("Impossible to manage the offer video");
        }    
        log.info("/ Room.manageOfferVideo"); 
        return sdpAnswer;
    }
    
    public void manageAddress(String addresseeUserName, String senderUserName, JsonObject address){
     //   log.info("* RoomManager.manageAddress -> {} <- {}: {}", addresseeUserName, senderUserName);
        
        ParticipantSession addressee = this.getParticipant(addresseeUserName);
        ParticipantSession sender = this.getParticipant(senderUserName);
        
	    if ((addressee != null) && (sender != null)) {
            addressee.addAddress(address, sender);
	    }
        else{
            log.error("Impossible to manage the ice candidate");
        }
        
    //    log.info("/ RoomManager.manageAddress"); 
    }
   
    //#
    public void printTheRoomParticipants(){
        log.info("The participants of the " + this.name + " room are: " + this.participantsByUserName.size());
        for(Map.Entry<String, ParticipantSession> entry : this.participantsByUserName.entrySet()){
            log.info("- " + entry.getKey());
        }
    }
    
 }
