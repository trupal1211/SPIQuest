package com.example.demo1.Entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class SubjectData {
    
    @Id
    private String subjectCode;
    private String subjectName;
    private float subjectCredit;
    private int totalMarks ;
    private Integer termWorkMark ;
    private Integer sessionalMark ;
    private Integer externalMark ;
    private Integer attendance ;

    @ManyToMany(mappedBy = "subjectData")
    private List<SemesterData> semesterData ;

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public float getSubjectCredit() {
        return subjectCredit;
    }

    public void setSubjectCredit(float subjectCredit) {
        this.subjectCredit = subjectCredit;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getTermWorkMark() {
        return termWorkMark;
    }

    public void setTermWorkMark(Integer termWorkMark) {
        this.termWorkMark = termWorkMark;
    }

    public Integer getSessionalMark() {
        return sessionalMark;
    }

    public void setSessionalMark(Integer sessionalMark) {
        this.sessionalMark = sessionalMark;
    }

    public Integer getExternalMark() {
        return externalMark;
    }

    public void setExternalMark(Integer externalMark) {
        this.externalMark = externalMark;
    }

    public Integer getAttendance() {
        return attendance;
    }

    public void setAttendance(Integer attendance) {
        this.attendance = attendance;
    }

    public List<SemesterData> getSemesterData() {
        return semesterData;
    }

    public void setSemesterData(List<SemesterData> semesterData) {
        this.semesterData = semesterData;
    }

}
