package uk.ac.herts.dd16abc.myblueforest.model;

import java.util.Date;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;

@Entity
public class Comment {

  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  @Column(name="cid")
  private long id;

  @Lob
  @Column(columnDefinition = "TEXT")
  private String details;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name="uid")
  private User owner;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name="pid")
  private Post post;

  @Column(name="dateCreated", nullable=false, updatable=false)
  private long dateCreated;

  @PrePersist
  public void prePersist() {
    long now = new Date().getTime();
    this.dateCreated = now;
  }

  public Comment() { } //empty constructor

  public long getId() {
    return this.id;
  }

  public long getDateCreated() {
    return this.dateCreated;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public String getDetails() {
    return this.details;
  }

  public void setPost(Post post) {
    this.post = post;
  }

  @JsonIgnore
  public Post getPost() {
    return this.post;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }

  public User getOwner() {
    return this.owner;
  }
}
