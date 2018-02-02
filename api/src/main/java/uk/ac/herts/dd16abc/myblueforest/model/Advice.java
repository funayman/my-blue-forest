package uk.ac.herts.dd16abc.myblueforest.model;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue(value="A")
public class Advice extends Post {

  public Advice() { } //empty constructor

}
