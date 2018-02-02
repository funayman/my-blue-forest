package uk.ac.herts.dd16abc.myblueforest.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Date;

import javax.persistence.*;

import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;

@Entity
@Inheritance
@Table(name="post")
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name="pid")
  private long id;

  @ManyToOne(fetch=FetchType.EAGER)
  @JoinColumn(name="uid")
  private User owner;

  private String title;

  @Lob
  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name="dateCreated", nullable=false, updatable=false)
  private long dateCreated;

  @Column(name="dateModified", nullable=false)
  private long dateModified;

  @Column(name="asset")
  private String assetUrl = "/assets/shared/default.png";

  @Convert(converter=PostTypeConverter.class)
  @Enumerated(EnumType.STRING)
  @Column(nullable=false)
  private PostType type;

  @ManyToMany(fetch=FetchType.EAGER)
  @JoinTable(name="post_tag",
    joinColumns={@JoinColumn(name="pid")},
    inverseJoinColumns={@JoinColumn(name="tid")})
  private Set<Tag> tags = new HashSet<Tag>();

  @OneToMany(cascade=CascadeType.ALL, mappedBy="post")
  private List<Comment> comments = new ArrayList<Comment>();

  @ManyToMany(fetch=FetchType.EAGER)
  @JoinTable(name="post_like",
    joinColumns={@JoinColumn(name="pid")},
    inverseJoinColumns={@JoinColumn(name="uid")})
  private Set<User> likes = new HashSet<User>();

  @ManyToMany(fetch=FetchType.EAGER, mappedBy="followedPosts")
  private Set<User> follwedUsers = new HashSet<User>();

  @OneToMany(cascade=CascadeType.ALL, mappedBy="post")
  private List<Rating> ratings = new ArrayList<Rating>();

  public Post() { } //empty constructor

  @PrePersist
  public void prePersist() {
    long now = new Date().getTime();
    this.dateCreated = now;
    this.dateModified = now;
  }

  @PreUpdate
  public void preUpdate() {
    this.dateModified = new Date().getTime();
  }

  public long getId() {
    return this.id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getTitle() {
    return this.title;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDescription() {
    return this.description;
  }

  public void setTags(Set<Tag> tags) {
    this.tags = tags;
  }

  public Set<Tag> getTags() {
    return this.tags;
  }

  public void setAssetUrl(String assetUrl) {
    this.assetUrl = assetUrl;
  }

  public String getAssetUrl() {
    return this.assetUrl;
  }

  public long getDateCreated() {
    return this.dateCreated;
  }

  public long getDateModified() {
    return this.dateModified;
  }

  public void setType(PostType type) {
    this.type = type;
  }

  public PostType getType() {
    return this.type;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }

  public User getOwner() {
    return this.owner;
  }

  public void setComments(List<Comment> comments) {
    this.comments = comments;
  }

  @JsonIgnore
  public List<Comment> getComments() {
    return this.comments;
  }

  public int getCommentsCount() {
    return this.comments.size();
  }

  public void addComment(Comment comment) {
    comments.add(comment);
    comment.setPost(this);
  }

  @JsonIgnore
  public Set<User> getLikes() {
    return this.likes;
  }

  public int getLikesCount() {
    return this.likes.size();
  }

  public void setFollwedUsers(Set<User> follwedUsers) {
    this.follwedUsers = follwedUsers;
  }

  @JsonIgnore
  public Set<User> getFollowedUsers() {
    return this.follwedUsers;
  }

  @Override
  public boolean equals(Object o) {
    if(this == o) { return true; }
    if( !(o instanceof Post) ) { return false; }
    return id == ((Post) o).getId();
  }

	@Override
	public String toString() {
		return "Post [id=" + id + ", title=" + title + ", description=" + description + ", dateCreated=" + dateCreated + ", dateModified=" + dateModified + ", assetUrl=" + assetUrl + ", type=" + type + ", tags=" + tags + "]";
	}
}
