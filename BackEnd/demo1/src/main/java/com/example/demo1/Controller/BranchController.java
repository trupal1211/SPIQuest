package com.example.demo1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo1.Entity.Branch;
import com.example.demo1.Entity.SemesterData;
import com.example.demo1.Entity.SubjectData;
import com.example.demo1.Service.BranchService;
import com.example.demo1.Service.SemesterDataService;
import com.example.demo1.Service.SubjectDataService;

@RestController
// @RequestMapping("/api")
public class BranchController {
    
    @Autowired
    private BranchService branchService;

    @Autowired
    private SubjectDataService subjectDataService;

    @Autowired
    private SemesterDataService semesterDataService;

    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getAllBranch() {

        return ResponseEntity.ok(branchService.getAllBranches());
    }

    @GetMapping("/branch/{branch_id}/semester/{semester_no}")
    public ResponseEntity<List<SubjectData>> getSubjectData(@PathVariable("branch_id") int branch_id ,@PathVariable("semester_no") int semester_no) {
    
        return ResponseEntity.ok(subjectDataService.findSubjectData(branch_id, semester_no));
    }

    @GetMapping("/branch/{branch_id}")
    public ResponseEntity<List<SemesterData>> getSemesterData(@PathVariable("branch_id") int branch_id) {

        return ResponseEntity.ok(semesterDataService.getSemesterData(branch_id));
    }

}
