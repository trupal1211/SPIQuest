package com.example.demo1.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo1.Entity.SemesterData;

@Repository
public interface SemesterDataRepository extends JpaRepository<SemesterData, Integer> {
    
   @Query(value="SELECT b FROM SemesterData b WHERE b.branch_Id = :branchId")
   public List<SemesterData> findByBranchId(@Param("branchId") int branchId);

}
