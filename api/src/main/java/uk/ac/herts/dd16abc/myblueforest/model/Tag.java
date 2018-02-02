package uk.ac.herts.dd16abc.myblueforest.model;

import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Tag {

  @Id
  @GeneratedValue
  @Column(name="tid")
  private long id;

  @Column(nullable=false, unique=true)
  private String name;

  @ManyToMany(fetch=FetchType.LAZY, mappedBy="tags")
  private Set<Post> posts;

  public Tag() { } //empty constructor

  public Tag(String name) {
    this.name = name;
  }

  public Tag(String name, Set<Post> posts) {
    this.name = name;
    this.posts = posts;
  }

  public long getId() {
    return this.id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return this.name;
  }

  public void setPosts(Set<Post> posts) {
    this.posts = posts;
  }

  @JsonIgnore
  public Set<Post> getPosts() {
    return this.posts;
  }

}
