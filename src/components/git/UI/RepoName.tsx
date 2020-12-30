import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { gitservice } from "../../../App";
import { gitService } from "../gitService";

interface RepoNameProps {}

export const RepoName: React.FC<RepoNameProps> = ({}) => {
  const [name, setNAme] = useState({ value: "" });
  const reponame = useBehaviorSubject(gitservice.reponameSubject)

  gitservice.reponameSubject.subscribe((x)=>{}).unsubscribe()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNAme({ value: e.currentTarget.value });
  };
  const saveName = () => {
      gitservice.reponameSubject.next(name.value)
      gitservice.reponame = name.value
      localStorage.setItem("currentRepo",name.value)
  };

  useEffect(()=>{
    let name:string = localStorage.getItem("currentRepo") || ""
    gitservice.reponame = name
    gitservice.reponameSubject.next(name)
  },[])

  return (
    <>
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={reponame===""?true:false} centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Give your repo a name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            onChange={handleChange}
            className="form-control w-100"
            type="text"
            id="reponame"
            
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => saveName()}>Save</Button>
        </Modal.Footer>
        <Modal.Footer>
          New user? Consult the help section to find out more about this plugin.
        </Modal.Footer>
      </Modal>
    </>
  );
};
