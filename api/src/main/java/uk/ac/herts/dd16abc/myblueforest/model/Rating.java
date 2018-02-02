package uk.ac.herts.dd16abc.myblueforest.model;

import javax.persistence.*;

import uk.ac.herts.dd16abc.myblueforest.model.user.User;
import uk.ac.herts.dd16abc.myblueforest.model.Post;

@Entity
@Table(name="rating")
public class Rating {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name="rid")
  private long id;

  private int value;

  @ManyToOne(cascade=CascadeType.MERGE, fetch=FetchType.EAGER)
  @JoinColumn(name="uid")
  private User user;

  @ManyToOne(cascade=CascadeType.MERGE, fetch=FetchType.EAGER)
  @JoinColumn(name="pid")
  private Post post;

  public Rating() { } //empty constructor

	public Rating(int value, User user, Post post) {
		this.value = value;
		this.user = user;
		this.post = post;
	}

	public long getId() {
		return this.id;
	}

	public int getValue() {
		return this.value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Post getPost() {
		return this.post;
	}

	public void setPost(Post post) {
		this.post = post;
	}

	@Override
	public String toString() {
		return "Rating [id=" + id + ", value=" + value + ", user=" + user + ", post=" + post + "]";
	}
}
