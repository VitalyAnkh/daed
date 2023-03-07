import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { gqlClient } from "~/api";
import { DEFAULT_TCP_CHECK_URL, DEFAULT_UDP_CHECK_DNS, GET_LOG_LEVEL_STEPS, QUERY_KEY_GENERAL } from "~/constants";
import { graphql } from "~/gql";

import CreateFormDrawer from "./CreateFormDrawer";
import NumberInput from "./NumberInput";

export type FormValues = {
  tproxyPort: number;
  logLevelIndex: number;
  tcpCheckUrl: string;
  udpCheckDns: string;
  checkIntervalSeconds: number;
  checkTolerenceSeconds: number;
  lanInterface: string[];
  wanInterface: string[];
  allowInsecure: boolean;
  dialMode: string;
  dns: string;
  routing: string;
};

const sliderLabelStyles = {
  mt: 2,
  ml: "-50%",
  w: "full",
  fontSize: "sm",
};

export default ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: UseFormReturn<FormValues>) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>();
  const { register, control } = form;

  const LOG_LEVEL_STEPS = GET_LOG_LEVEL_STEPS(t);

  const interfacesQuery = useQuery(QUERY_KEY_GENERAL, async () =>
    gqlClient.request(
      graphql(`
        query General {
          general {
            interfaces {
              name
            }
          }
        }
      `)
    )
  );

  return (
    <CreateFormDrawer<FormValues>
      header={t("config")}
      isOpen={isOpen}
      onClose={onClose}
      form={form}
      onSubmit={onSubmit}
    >
      <Tabs>
        <TabList>
          <Tab>{t("global")}</Tab>
          <Tab>{t("dns")}</Tab>
          <Tab>{t("routing")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction="column" gap={4}>
              <FormControl>
                <FormLabel>{t("tproxyPort")}</FormLabel>

                <Controller
                  name="tproxyPort"
                  control={control}
                  defaultValue={12345}
                  render={({ field }) => <NumberInput min={0} max={65535} {...field} />}
                />
              </FormControl>

              <FormControl pb={4}>
                <FormLabel>{t("logLevel")}</FormLabel>

                <Controller
                  name="logLevelIndex"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <Slider max={LOG_LEVEL_STEPS.length - 1} textAlign="center" {...field}>
                      <>
                        {LOG_LEVEL_STEPS.map(([name], i) => (
                          <SliderMark key={i} value={i} {...sliderLabelStyles}>
                            {name}
                          </SliderMark>
                        ))}
                      </>

                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>

                      <SliderThumb />
                    </Slider>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("tcpCheckUrl")}</FormLabel>

                <Input defaultValue={DEFAULT_TCP_CHECK_URL} {...register("tcpCheckUrl")} />
              </FormControl>

              <FormControl>
                <FormLabel>{t("udpCheckDns")}</FormLabel>

                <Input defaultValue={DEFAULT_UDP_CHECK_DNS} {...register("udpCheckDns")} />
              </FormControl>

              <FormControl>
                <FormLabel>{`${t("checkInterval")} (${t("seconds")})`}</FormLabel>

                <Controller
                  name="checkIntervalSeconds"
                  control={control}
                  defaultValue={10}
                  render={({ field }) => <NumberInput min={0} {...field} />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{`${t("checkTolerance")} (${t("seconds")})`}</FormLabel>

                <Controller
                  name="checkTolerenceSeconds"
                  control={control}
                  defaultValue={10}
                  render={({ field }) => <NumberInput min={0} {...field} />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("lanInterface")}</FormLabel>

                <Select {...register("lanInterface")}>
                  {interfacesQuery.data?.general.interfaces.map(({ name }) => (
                    <option key={name}>{name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t("wanInterface")}</FormLabel>

                <Select {...register("wanInterface")}>
                  {interfacesQuery.data?.general.interfaces.map(({ name }) => (
                    <option key={name}>{name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t("allowInsecure")}</FormLabel>

                <Switch {...register("allowInsecure")} />
              </FormControl>

              <FormControl>
                <FormLabel>{t("dialMode")}</FormLabel>

                <Select {...register("dialMode")}>
                  <option>{t("ip")}</option>
                  <option>{t("domain")}</option>
                  <option>{t("domain+")}</option>
                </Select>
              </FormControl>
            </Flex>
          </TabPanel>

          <TabPanel>
            <Textarea {...register("dns")} />
          </TabPanel>

          <TabPanel>
            <Textarea {...register("routing")} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </CreateFormDrawer>
  );
};