package uk.ac.herts.dd16abc.myblueforest.model.user;

import javax.persistence.*;

@Embeddable
public class Region {

  private String postCode;
  private String prefecture;
  private String city;
  private String area;
  private String prefectureJP;
  private String cityJP;
  private String areaJP;

	public Region() { } //empty constructor

	public Region(String postCode, String prefecture, String city, String area, String prefectureJP, String cityJP, String areaJP) {
		this.postCode = postCode;
		this.prefecture = prefecture;
		this.city = city;
		this.area = area;
		this.prefectureJP = prefectureJP;
		this.cityJP = cityJP;
		this.areaJP = areaJP;
	}

  //getters and setters
	public String getPostCode() {
		return this.postCode;
	}

	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}

	public String getPrefecture() {
		return this.prefecture;
	}

	public void setPrefecture(String prefecture) {
		this.prefecture = prefecture;
	}

	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getArea() {
		return this.area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getPrefectureJP() {
		return this.prefectureJP;
	}

	public void setPrefectureJP(String prefectureJP) {
		this.prefectureJP = prefectureJP;
	}

	public String getCityJP() {
		return this.cityJP;
	}

	public void setCityJP(String cityJP) {
		this.cityJP = cityJP;
	}

	public String getAreaJP() {
		return this.areaJP;
	}

	public void setAreaJP(String areaJP) {
		this.areaJP = areaJP;
	}

	@Override
	public String toString() {
		return "Region [postCode=" + postCode + ", prefecture=" + prefecture + ", city=" + city + ", area=" + area + ", prefectureJP=" + prefectureJP + ", cityJP=" + cityJP + ", areaJP=" + areaJP + "]";
	}
}
