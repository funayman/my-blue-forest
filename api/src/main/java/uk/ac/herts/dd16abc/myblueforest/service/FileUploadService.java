package uk.ac.herts.dd16abc.myblueforest.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {
  protected static final String FILE_DIR = "/app/shared/";
  public static final String WEB_DIR = "/assets/shared/";

  public FileUploadService() { } //empty constructor


  public boolean save(MultipartFile mpf, String fileName) throws IOException, NullPointerException {
    //save the file!
    byte[] bytes = mpf.getBytes();
    Path path = Paths.get(FILE_DIR + fileName);
    Files.write(path, bytes);

    return true;
  }

  public String generateUniqueFilename(String... inputs) throws NoSuchAlgorithmException {
    Date now = new Date();
    StringBuffer fileNameSB = new StringBuffer(String.format("%d", now.getTime()));
    for(String input : inputs) {
      fileNameSB.append(input);
    }

    //https://stackoverflow.com/questions/4895523/java-string-to-sha1
    MessageDigest mDigest = MessageDigest.getInstance("SHA1");
    byte[] result = mDigest.digest(fileNameSB.toString().getBytes());
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < result.length; i++) {
      sb.append(Integer.toString((result[i] & 0xff) + 0x100, 16).substring(1));
    }
    return sb.toString();
  }

  public String getFileExtension(String file) {
    if(file == null) { return null; }

    return file.substring(file.indexOf("."));
  }
}
