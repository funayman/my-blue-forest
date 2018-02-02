package uk.ac.herts.dd16abc.myblueforest.model.user;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import uk.ac.herts.dd16abc.myblueforest.model.Post;

@Entity
public class User {

  @Id
  @GeneratedValue
  @Column(name="uid")
  private long id;

  @Column(unique=true)
  private String username;
  private String password;

  @OneToMany(fetch=FetchType.EAGER, cascade=CascadeType.ALL)
  @JoinTable(name="user_role", joinColumns={@JoinColumn(name="uid")}, inverseJoinColumns={@JoinColumn(name="rid")})
  private Set<Role> roles;

  @OneToMany(cascade=CascadeType.MERGE, fetch=FetchType.EAGER, orphanRemoval=true, mappedBy="owner")
  private List<Post> posts = new ArrayList<Post>();

  @ManyToMany(fetch=FetchType.EAGER)
  @JoinTable(name="user_follow",
    joinColumns={@JoinColumn(name="uid")},
    inverseJoinColumns={@JoinColumn(name="pid")})
  private Set<Post> followedPosts = new HashSet<Post>();

  @Embedded
  private Region region;

  private long dateCreated;

  @PrePersist
  public void prePersist() {
    long now = new Date().getTime();
    this.dateCreated = now;
  }

  public User() { } //empty constructor

  public User(String username, String password, Region region) {
    this.username = username;
    this.password = password;
    this.region = region;
  }

  public User(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.password = user.getPassword();
    this.roles = user.getRoles();
    this.posts = user.getPosts();
    this.region = user.getRegion();
    this.followedPosts = user.getFollowedPosts();
  }

  public long getId() {
    return this.id;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  @JsonIgnore
  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @JsonIgnore
  public Set<Role> getRoles() {
    return this.roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  @JsonIgnore
  public List<Post> getPosts() {
    return this.posts;
  }

  @JsonIgnore
  public Set<Post> getFollowedPosts() {
    return this.followedPosts;
  }

  public Region getRegion() {
    return this.region;
  }

  public void setRegion(Region region) {
    this.region = region;
  }

  public long getDateCreated() {
    return this.dateCreated;
  }

  public void setDateCreated(long dateCreated) {
    this.dateCreated = dateCreated;
  }

  public void addPost(Post post) {
    posts.add(post);
    post.setOwner(this);
  }

  public void deletePost(Post post) {
    posts.remove(post);
    post.setOwner(null);
  }

  @Override
  public boolean equals(Object o) {
    if(this == o) { return true; }
    if( !(o instanceof User) ) { return false; }
    return this.id == ((User) o).getId();
  }
}
