package uk.ac.herts.dd16abc.myblueforest.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public enum PostType {
  QUESTION("Q"),
  REVIEW("R"),
  ADVICE("A"),
  GENERAL("G");

  @Id @Column(unique=true)
  private String value;

  PostType(String value) {
    this.value = value;
  }

  public String getValue() {
    return this.value;
  }

  public static PostType getType(String s) {
    for(PostType value : PostType.values()) {
      if(value.getValue().equals(s)) { return value; }
    }

    return null;
  }
}
