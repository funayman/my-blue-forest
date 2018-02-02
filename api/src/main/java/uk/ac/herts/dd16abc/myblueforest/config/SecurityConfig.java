package uk.ac.herts.dd16abc.myblueforest.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import uk.ac.herts.dd16abc.myblueforest.auth.RestAuthenticationEntryPoint;
import uk.ac.herts.dd16abc.myblueforest.auth.RestAuthenticationSuccessHandler;
import uk.ac.herts.dd16abc.myblueforest.service.user.BFUserDetailsService;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private BFUserDetailsService userDetailsService;

  @Autowired
  private RestAuthenticationEntryPoint authenticationEntryPoint;

  @Autowired
  private RestAuthenticationSuccessHandler authenticationSuccessHandler;

  @Override
  protected void configure(AuthenticationManagerBuilder builder) throws Exception {
    builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .csrf().disable()
      .exceptionHandling()
        .authenticationEntryPoint(authenticationEntryPoint)
      .and()
      .authorizeRequests()
        .antMatchers(HttpMethod.POST, "/**/register").permitAll()
        .antMatchers(HttpMethod.POST, "/**").authenticated()
        .antMatchers(HttpMethod.PUT, "/**").authenticated()
        .antMatchers(HttpMethod.DELETE, "/**").authenticated()
        .antMatchers("/**/me/**").authenticated()
        .anyRequest().permitAll()
      .and()
      //.httpBasic().and()
      .formLogin()
        .usernameParameter("u")
        .passwordParameter("p")
        .successHandler(authenticationSuccessHandler)
        .failureHandler(new SimpleUrlAuthenticationFailureHandler())
      .and()
      .logout();
      //.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(11);
  }
}
