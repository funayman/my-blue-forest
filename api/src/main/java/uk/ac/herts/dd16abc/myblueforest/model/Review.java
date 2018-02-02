package uk.ac.herts.dd16abc.myblueforest.model;

import javax.persistence.Entity;
import javax.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue(value="R")
public class Review extends Post {

  public Review() { } //empty constructor

}
