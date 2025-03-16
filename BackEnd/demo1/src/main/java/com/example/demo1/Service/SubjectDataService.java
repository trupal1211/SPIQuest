package com.example.demo1.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo1.Entity.SubjectData;
import com.example.demo1.Repository.SubjectDataRepository;

@Service
public class SubjectDataService {
    
    @Autowired
    private SubjectDataRepository subjectDataRepository;

    public List<SubjectData> findSubjectData(int b_id , int s_id)
    {
        return subjectDataRepository.findSubjectByBranchAndSemester(b_id,s_id);
    }
}
