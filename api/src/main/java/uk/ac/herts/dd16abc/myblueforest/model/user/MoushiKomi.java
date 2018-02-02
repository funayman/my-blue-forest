package uk.ac.herts.dd16abc.myblueforest.model.user;

public class MoushiKomi {
  private String username;
  private String password;
  private String passconf;
  private Region region;

  public MoushiKomi() { } //empty constructor

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassconf() {
		return this.passconf;
	}

	public void setPassconf(String passconf) {
		this.passconf = passconf;
	}

	public Region getRegion() {
		return this.region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	@Override
	public String toString() {
		return "MoushiKomi [username=" + username + ", password=" + password + ", passconf=" + passconf + "]";
	}
}
