package com.example.demo1.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo1.Entity.SemesterData;
import com.example.demo1.Repository.SemesterDataRepository;

@Service
public class SemesterDataService {
    
    @Autowired
    private SemesterDataRepository semesterDataRepository ;

    public List<SemesterData> getSemesterData(int b_id)
    {
        return semesterDataRepository.findByBranchId(b_id);
    }
}
