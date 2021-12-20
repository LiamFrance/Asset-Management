package com.nashtech.assetmanagementwebservice.domain;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "returns")
public class Return {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String acceptedBy;
    private LocalDate returnedDate;
    private String state;
    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    public Return() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAcceptedBy() {
        return acceptedBy;
    }

    public void setAcceptedBy(String acceptedBy) {
        this.acceptedBy = acceptedBy;
    }

    public LocalDate getReturnedDate() {
        return returnedDate;
    }

    public void setReturnedDate(LocalDate returnedDate) {
        this.returnedDate = returnedDate;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    @Override
    public String toString() {
        return "Return{" +
                "id=" + id +
                ", acceptedBy='" + acceptedBy + '\'' +
                ", returnedDate=" + returnedDate +
                ", state='" + state + '\'' +
                ", assignment=" + assignment +
                '}';
    }
}
