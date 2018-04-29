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
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.EntityListeners;
import javax.persistence.Transient;
import javax.persistence.CascadeType;
import org.kurento.client.Continuation;
import org.kurento.client.MediaPipeline;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.google.gson.annotations.Expose;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Room
 * 
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
*/
@MappedSuperclass
//@EnableJpaAuditing
public class Room implements  Comparable<Room>{
    
    @Exclude
    @Transient
    private final Logger log = LoggerFactory.getLogger(Room.class);
    
    @Id
    @GeneratedValue
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    
    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP) 
    @CreatedDate
    protected Date createdAt;
    
    @Column(nullable = false)
    protected String name = "";
    
    @Column(nullable = false)
    protected String tutor = "";
    

    protected Room(){};
       

    public Room(String name, String tutor){
        this(name);
        this.tutor = tutor;
    };

    public Room(String name){
       this.name = name;
    };

    public Room(MediaRoom room){
        this.log.info("new Room");
        this.log.info(room.toString());
        this.id = room.getId();
        this.name = room.getName();
        this.createdAt = room.getCreatedAt();
        this.tutor = room.getTutor() ;
        this.log.info(this.toString());
    }

    public Room(Room room){
        this.log.info("new Room");
        this.log.info(room.toString());
        this.id = room.getId();
        this.name = room.getName();
        this.createdAt = room.getCreatedAt();
        this.tutor = room.getTutor() ;
        this.log.info(this.toString());
    }
    
    
    public Long getId(){
        return this.id;
    }

    public Date getCreatedAt(){
        return this.createdAt;
    }
    
    public String getName() {
        return this.name;
    }

    public String getTutor(){
        return this.tutor;
    }

    public void setTutor(String tutor){
        if (this.tutor.equals("")){
            this.tutor = tutor;
        }
    }
    
    @Override
    public String toString(){
            JsonObject json = new JsonObject();
            json.addProperty("id", this.getId().toString());
            json.addProperty("createdAt", this.getCreatedAt().toString());
            json.addProperty("name", this.name);
            json.addProperty("tutor", this.tutor);
        return json.toString();
    }

    @JsonIgnore
    public boolean isTheTutor(String userName){
        log.info("* MediaRoom.isTheTutor?: {}", userName);
        log.info("Tutor: " + this.tutor);
        return this.tutor.equals(userName);
    }

    
    @Override
    public int compareTo(Room room) {
      //  log.info("Room.compareTo");
       // log.info(room.toString());
       // log.info(this.toString());
        if ((room == null) || !(room instanceof Room)) {
            return 1;
        }
        int result = 0;
        try{
            result = this.getId().compareTo(room.getId());
        }
        catch(Exception e){ result = 0;}    
        if (result == 0) {
            result = this.getCreatedAt().compareTo(room.getCreatedAt());
            if (result == 0) {
                result = this.getName().compareTo(room.getName());
                if (result == 0) {
                    result = this.getTutor().compareTo(room.getTutor());
                }
            }
        }
       return result;
    }
    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.id == null) ? 0 : this.id.hashCode());
        result = prime * result + ((this.name == null) ? 0 : this.name.hashCode());
        result = prime * result + ((this.createdAt == null) ? 0 : this.createdAt.hashCode());
        return result;
    }
    
    
    @Override
    public boolean equals(Object obj) {
        
        if (this == obj) {
            return true;
    }
    if ((obj == null) || !(obj instanceof Room)) {
            return false;
    }
    Room other = (Room) obj;
    boolean eq = this.compareTo(other) == 0;

    return eq;
    }
    
 }
