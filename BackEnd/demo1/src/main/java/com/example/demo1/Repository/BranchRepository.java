package com.example.demo1.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo1.Entity.Branch;


@Repository
public interface BranchRepository extends JpaRepository <Branch ,Integer> {
    
    @Query(value="select * from branches" , nativeQuery = true)
    public List<Branch> findByBranchId();

}
