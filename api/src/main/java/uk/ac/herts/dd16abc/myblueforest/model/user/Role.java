package uk.ac.herts.dd16abc.myblueforest.model.user;

import javax.persistence.*;

@Entity
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name="rid")
  private long id;
  
  private String name;

  public Role() { } //empty constructor

  public Role(String name) {
    this.name = name;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

}
