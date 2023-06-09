import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { DateGroup, aaa, bbbb, randomDates } from "../pages/utils";
import { Button, Card, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import { ChoiceSelection, groupDates } from "./utiils";
import { ResultItem } from "../models/ResultItem";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { HistoryResultItem } from "../models/HistoryResultItem";
import { FaMinus, FaPlus } from "react-icons/fa";
import Image from 'react-bootstrap/Image';

const HistoryVisualisation: React.FC<{
  dataset: HistoryResultItem[],
}> = ({
  dataset
}) => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const theme = useContext(SessionContext)

    const [selectedValue, setSelectedValue] = useState(undefined);

    const [selectedView, setSelectedView] = useState<ChoiceSelection>(ChoiceSelection.decades);

    const [dateGroups, setDateGroups] = useState<{
      [key: string]: HistoryResultItem[];
    }>({});

    const [keys, setKeys] = useState<any[]>([]);
    const [key, setKey] = useState('');

    const [cardsView, setCardsView] = useState(false);

    const [index, setIndex] = useState(0);

    const handleCardsSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueIndex = parseInt(event.target.value, 10);
      setIndex(valueIndex);
    };

    useEffect(() => {
    }, []);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueIndex = parseInt(event.target.value, 10);
      setKey(keys[valueIndex])
      // console.log(dateGroups[key][0].value.value)
    };

    function changeToCardsView() {
      setIndex(4)
      setCardsView(true)
    }

    const handleSelect = (selectedIndex: any) => {
      setIndex(selectedIndex);
    };

    function changeToTimelineView() {
      const grouped = groupDates(dataset, selectedView)
      const keys = Object.keys(grouped)

      setKeys(keys)
      setKey(keys[0])
      setDateGroups(grouped)
      console.log(grouped)

      setCardsView(false)
    }


    return (
      <div>
        {!cardsView ? (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-toggle"
            onClick={() => changeToCardsView()}
            variant="success">
            <FaMinus></FaMinus>
          </Button>
        ) : (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-toggle"
            onClick={
              () => changeToTimelineView()
            }
            variant="success">
            <FaPlus></FaPlus>
          </Button>
        )}

        {!cardsView ? (
          <Container fluid>
            <Row>
              <Form.Range
                min={0}
                max={keys.length - 1}
                step={1}
                // value={keys.findIndex((value: any) => value === key)}
                onChange={handleSliderChange}
              // value={"key"}
              />

            </Row>
            <Row>
              <Col>
                <p>
                  Values:{' '}
                  {key && dateGroups[key] && dateGroups[key].map((item) => {
                    return (
                      <div>
                        {item.label.value + ": " + item.propertyLabel.value + " - " + item.value.value}
                      </div>
                    )
                  })}
                </p>
              </Col>
            </Row>

          </Container>
        ) : (
          <Container fluid>
            <Row>
              <Form.Range
                min={0}
                max={dataset.length - 1}
                step={1}
                // value={keys.findIndex((value: any) => value === key)}
                onChange={handleCardsSliderChange}
                value={index}
              />

            </Row>
            <Row>
              <Carousel
                slide={false}
                onSelect={handleSelect}
                activeIndex={index}
                indicators={false}
                data-bs-theme="dark"
                className="timeline-carousel">
                {dataset.map((item, index) => {
                  return (
                    <Carousel.Item>
                      <div className="timeline-card">
                        <div className="timeline-img-container">
                          <Image className="timeline-img" src={item.thumbnail.value} />
                        </div>
                        <div className="timeline-info-container">
                          <div>
                            <h2>{item.label.value}</h2>
                            <h6>{item.propertyLabel.value}: {item.value.value}</h6>
                          </div>
                          <div className="timeline-info-abstract">
                            {item.abstract.value}
                            <br />
                          </div>
                        </div>
                      </div>
                    </Carousel.Item>

                  )
                })}
              </Carousel>
            </Row>

          </Container>
        )}
      </div >
    )

  };

export default HistoryVisualisation;
