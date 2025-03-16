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
    private int termWorkMark ;
    private int sessionalMark ;
    private int externalMark ;
    private float attendance ;

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

    public int getTermWorkMark() {
        return termWorkMark;
    }

    public void setTermWorkMark(int termWorkMark) {
        this.termWorkMark = termWorkMark;
    }

    public int getSessionalMark() {
        return sessionalMark;
    }

    public void setSessionalMark(int sessionalMark) {
        this.sessionalMark = sessionalMark;
    }

    public int getExternalMark() {
        return externalMark;
    }

    public void setExternalMark(int externalMark) {
        this.externalMark = externalMark;
    }

    public float getAttendance() {
        return attendance;
    }

    public void setAttendance(float attendance) {
        this.attendance = attendance;
    }

    public List<SemesterData> getSemesterData() {
        return semesterData;
    }

    public void setSemesterData(List<SemesterData> semesterData) {
        this.semesterData = semesterData;
    }

    

}
