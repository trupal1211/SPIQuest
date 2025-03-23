package com.example.demo1.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo1.Entity.SubjectData;

@Repository
public interface SubjectDataRepository extends JpaRepository<SubjectData, Integer> {
    
    @Query(value = "SELECT sd.* FROM subject_data sd JOIN subject_semester ss ON sd.subject_code = ss.subject_code JOIN semester_data sm ON ss.semester_data_id = sm.semester_data_id WHERE sm.branch_id = :branchId AND sm.semester_no = :semesterNo"  //
                ,nativeQuery = true)
    public List<SubjectData> findSubjectByBranchAndSemester(@Param("branchId") int branchId, @Param("semesterNo") int semesterNo);
}
