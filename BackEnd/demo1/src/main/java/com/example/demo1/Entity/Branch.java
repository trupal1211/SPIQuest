package com.example.demo1.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Branches")
public class Branch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int branchId;
    private String branchName;

    @OneToMany(mappedBy = "branch")
    @JsonManagedReference
    private List<SemesterData> semesterData;

    public int getBranchId() {
        return branchId;
    }

    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public List<SemesterData> getSemesterData() {
        return semesterData;
    }

    public void setSemesterData(List<SemesterData> semesterData) {
        this.semesterData = semesterData;
    }
    
}
