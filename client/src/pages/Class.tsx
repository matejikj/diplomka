import React, { useEffect, useState, useRef, useContext } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import { ClassDataset } from "../models/types/ClassDataset";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useNavigate, useLocation } from "react-router-dom";
import { getMindMap } from "../service/mindMapService";
import { getDefaultSession, fetch, login } from "@inrupt/solid-client-authn-browser";
import {
  WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { generate_uuidv4 } from "../service/utils";
import { Link } from "../models/types/Link";
import { getClassDataset } from "../service/classService";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";
import './Class.css';
import { FcComments } from "react-icons/fc";
import { Exam } from "../models/types/Exam";

const exampleExams: Exam[] = [{
  id: generate_uuidv4(),
  profile: 'inrupt.com/matejikj',
  mindMap: 'aaaaa',
  max: 5,
  result: 3
}]



const Class: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext)

  const ref = useRef(null);
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);
  const [url, setUrl] = useState('');
  const [modelClassAddShow, setModelClassAddShow] = useState(false);
  const [dataset, setDataset] = useState<ClassDataset>();

  const [mounted, setMounted] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.url !== null) {
          setUrl(location.state.url)
          const websocket4 = new WebsocketNotification(
            location.state.url,
            { fetch: fetch }
          );
          websocket4.on("message", (e: any) => {
            getClassDataset(sessionContext.sessionInfo, location.state.url).then((res: any) => {
              setDataset(res)
              console.log(dataset?.mindMaps.length)
            })
          });
          websocket4.connect();
          if (sessionContext.sessionInfo.isLogged) {
            getClassDataset(sessionContext.sessionInfo, location.state.url).then((res: any) => {
              setDataset(res)
              console.log(dataset?.mindMaps.length)
            })
          }
        } else {
          navigate('/')
        }
      }
    }, [mounted])
  // if (location.state !== null && location.state.url !== null) {
  //   // const websocket4 = new WebsocketNotification(
  //   //   location.state.url,
  //   //   { fetch: fetch }
  //   // );
  //   // websocket4.on("message", (e: any) => {
  //   //   getClassDataset(location.state.url).then((res: any) => {
  //   //   })
  //   // });
  //   // websocket4.connect();
  //   console.log(location.state)
  //   if (sessionContext.sessionInfo.isLogged) {
  //     getClassDataset(sessionContext.sessionInfo, location.state.url).then((res: any) => {
  //       setDataset(res)
  //       console.log(dataset?.mindMaps.length)
  //     })
  //   }



  const showMindMap = (e: any) => {
    console.log(e)
    navigate('/visualisation/', {
      state: {
        id: e
      }
    })

    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const removeMindMap = (e: any) => {
    console.log(e.target.name)
    // navigate('/class/', {
    //   state: {
    //     url: e.target.name
    //   }
    // })
  }

  const handleCreate = (e: any) => {
    // if (sessionContext.sessionInfo.isLogged) {
    //   createNewClass(name, sessionContext.sessionInfo).then((res) => {
    //     console.log(res)
    //     // navigate('/class/', {
    //     //   state: {
    //     //     url: res
    //     //   }
    //     // })
    //   })
    // }
  }

  const handleAddExisting = (e: any) => {
    setModelClassAddShow(true)
    // if (sessionContext.sessionInfo.isLogged) {
    //   createNewClass(name, sessionContext.sessionInfo).then((res) => {
    //     console.log(res)
    //     // navigate('/class/', {
    //     //   state: {
    //     //     url: res
    //     //   }
    //     // })
    //   })
    // }
  }

  const sendMessage = (e: string) => {
    navigate('/messages/', {
      state: {
        friendId: e
      }
    })
  }

  const showExam = (e: any) => {
    console.log(e.target.name)
    navigate('/exam/', {
      state: {
        id: e.target.name
      }
    })
  }


  const copyToClipboard = (e: any) => {
    navigator.clipboard.writeText(sessionContext.sessionInfo.webId + "?classId=" + dataset?.id!)
  }

  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
      <main ref={ref}>
        <Container>
          <Row>
            <Col sm="6">
              <h1>Class {dataset?.name}</h1>
            </Col>
            <Col sm="6">
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <h6>Teacher: {dataset?.teacher}</h6>
            </Col>
            <Col sm="6">
              {
                (sessionContext.sessionInfo.webId === dataset?.teacher) &&
                <Stack direction="horizontal" gap={2}>
                  <h6>Link for copy</h6>
                  <Button onClick={copyToClipboard} variant="success">copy</Button>
                </Stack>
              }
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Classes mindMaps</h4>
                    {dataset?.mindMaps.length === 0 &&
                      <p>No mindMaps already</p>
                    }

                  </Row>
                  {dataset?.mindMaps.map((item, index) => {
                    return (
                      <Row key={index}>
                        <Col>
                          <Stack direction="horizontal" gap={2}>
                            {item.title}
                            <div>
                              <Button
                                className='class-btn'
                                name={item.url}
                                onClick={() => showMindMap(item.url)}
                                variant="success"
                              >Show</Button>
                              <br />
                            </div>
                            <div>
                              <Button
                                className='class-btn'
                                name={item.url}
                                onClick={removeMindMap}
                                variant="success"
                              >Remove</Button>
                              <br />
                            </div>
                            <div>
                              <Button
                                className='class-btn'
                                name={item.url}
                                onClick={showExam}
                                variant="success"
                              >Exam</Button>
                              <br />
                            </div>

                          </Stack>
                        </Col>
                      </Row>
                    )
                  })}
                  <Button onClick={handleCreate} variant="outline-success">Create new</Button>
                  <Button onClick={handleAddExisting} variant="outline-success">Add existing</Button>
                </Container>
              </Card>

            </Col>
            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Pupils</h4>
                    {dataset?.students.length === 0 &&
                      <p>No pupils already</p>
                    }

                  </Row>
                  {dataset?.students.map((item, index) => {
                    return (
                      <Row key={index}>
                        <Col sm={9}>{item.name} {item.surname}</Col>
                        <Col sm={3}>

                          <Stack direction="horizontal" gap={2}>
                            <Button className="class-message" variant="outline" onClick={() => { sendMessage(item.webId) }}><FcComments> </FcComments></Button>

                          </Stack>
                        </Col>
                      </Row>
                    )
                  })}
                </Container>
              </Card>

            </Col>
            <Col sm="6">
              <Card className="class-card">
                <Container>
                  <Row>
                    <h4>Exams</h4>
                    {exampleExams.length === 0 &&
                      <p>No exams already</p>
                    }

                  </Row>
                  <table>
                    <tr>
                      <th>Pupil</th>
                      <th>MindMap</th>
                      <th>Max</th>
                      <th>Result</th>
                    </tr>
                    {exampleExams.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.profile}</td>
                          <td>{item.mindMap}</td>
                          <td>{item.max}</td>
                          <td>{item.result}</td>
                        </tr>

                        // <Row key={index}>
                        //   <Col sm={9}>{item.name} {item.surname}</Col>
                        //   <Col sm={3}>

                        //     <Stack direction="horizontal" gap={2}>
                        //       <Button className="class-message" variant="outline" onClick={() => { sendMessage(item.webId) }}><FcComments> </FcComments></Button>

                        //     </Stack>
                        //   </Col>
                        // </Row>
                      )
                    })}
                  </table>

                </Container>
              </Card>

            </Col>

          </Row>
        </Container>
      </main>
    </div>
  )

};

export default Class;