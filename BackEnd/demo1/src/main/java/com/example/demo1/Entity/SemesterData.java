package com.example.demo1.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;


@Entity
public class SemesterData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int semesterDataId;
    private int semesterNo;
    private float semesterCredit ;

    @ManyToOne
    @JoinColumn(name = "branchId")
    @JsonBackReference
    private Branch branch ;

    @ManyToMany()
    @JoinTable(
        name = "Subject_Semester", 
        joinColumns = { @JoinColumn(name = "semesterDataId") }, 
        inverseJoinColumns = { @JoinColumn(name = "subjectCode") }
    )
    private List<SubjectData> subjectData ;


    public int getSemesterDataId() {
        return semesterDataId;
    }

    public void setSemesterDataId(int semesterDataId) {
        this.semesterDataId = semesterDataId;
    }

    public int getSemester() {
        return semesterNo;
    }

    public void setSemester(int semesterNo) {
        this.semesterNo = semesterNo;
    }

    public float getSemesterCredit() {
        return semesterCredit;
    }

    public void setSemesterCredit(float semesterCredit) {
        this.semesterCredit = semesterCredit;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    
}
