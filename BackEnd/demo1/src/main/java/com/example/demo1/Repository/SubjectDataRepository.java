package com.example.demo1.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo1.Entity.SubjectData;

@Repository
public interface SubjectDataRepository extends JpaRepository<SubjectData, Integer> {
    
    @Query(value = "SELECT * FROM subject_data WHERE subject_code IN (" +
               "SELECT subject_code FROM subject_semester WHERE semester_data_id IN (" +
               "SELECT semester_data_id FROM semester_data WHERE branch_id = :branchId AND semester_no = :semesterNo))",nativeQuery = true)
    public List<SubjectData> findSubjectByBranchAndSemester(@Param("branchId") int branchId, @Param("semesterNo") int semesterNo);
}
