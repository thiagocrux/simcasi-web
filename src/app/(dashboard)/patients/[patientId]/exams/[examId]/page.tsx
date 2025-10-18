'use client';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Datepicker from '@/components/atoms/Datepicker';
import Input from '@/components/atoms/Input';
import Modal from '@/components/atoms/Modal';
import TextArea from '@/components/atoms/TextArea';
import { CreateExamDTO, UpdateExamDTO } from '@/services/types/exams';
import { formatSafeBirthDate } from '@/utils/date';
import { formatToDateString } from '@/utils/formatToDateString';
import { getRequiredMessage } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import {
  createExamAction,
  getExamAction,
  updateExamAction,
} from '@/app/actions/examActions';

export default function ExamForm() {
  const router = useRouter();
  const { patientId, examId } = useParams();
  const isUpdatingExam = !!examId && examId !== 'new';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    treponemalTestType: z
      .string()
      .min(1, getRequiredMessage('Tipo de teste treponêmico')),
    treponemalTestResult: z
      .string()
      .min(1, getRequiredMessage('Resultado do teste treponêmico')),
    treponemalTestDate: z
      .string()
      .min(1, getRequiredMessage('Data do teste treponêmico')),
    treponemalTestLocation: z
      .string()
      .min(1, getRequiredMessage('Local do teste treponêmico')),
    nontreponemalVdrlTest: z
      .string()
      .min(1, getRequiredMessage('Teste VDRL não treponêmico')),
    nontreponemalTestTitration: z
      .string()
      .min(1, getRequiredMessage('Titulação do teste não treponêmico')),
    nontreponemalTestDate: z
      .string()
      .min(1, getRequiredMessage('Data do teste não treponêmico')),
    otherNontreponemalTest: z.string().nullable().optional(),
    otherNontreponemalTestDate: z.string().nullable().optional(),
    referenceObservations: z
      .string()
      .min(1, getRequiredMessage('Observações de referência')),
  });

  type Inputs = z.infer<typeof schema>;

  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
    trigger,
  } = methods;

  // FIXME: Delete after testing
  const watchedValues = watch();

  const { data: getExamResponse, isSuccess } = useQuery({
    queryKey: ['exams', examId],
    queryFn: () => getExamAction(examId as string),
    enabled: isUpdatingExam,
  });

  const createExamMutation = useMutation({
    mutationFn: (data: CreateExamDTO) => createExamAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: (data: UpdateExamDTO) =>
      updateExamAction(examId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    if (isSuccess && getExamResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getExamResponse.data)
            .filter(
              ([key]) =>
                !['treponemalTestDate', 'nonTreponemalTestDate'].includes(key)
            )
            .map(([key, value]) => [key, value === null ? undefined : value])
        ),
        treponemalTestDate: formatSafeBirthDate(
          getExamResponse.data.treponemalTestDate
        ),
        nontreponemalTestDate: formatSafeBirthDate(
          getExamResponse.data.nontreponemalTestDate
        ),
        otherNontreponemalTestDate: formatSafeBirthDate(
          getExamResponse.data.otherNontreponemalTestDate
        ),
      };

      reset(formData);

      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [isSuccess, getExamResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreateExamDTO = {
      ...data,
      treponemalTestDate: formatToDateString(data.treponemalTestDate),
      nontreponemalTestDate: formatToDateString(data.nontreponemalTestDate),
      otherNontreponemalTest: data.otherNontreponemalTest ?? null,
      otherNontreponemalTestDate: data.otherNontreponemalTestDate
        ? formatToDateString(data.otherNontreponemalTestDate)
        : null,
      patient: patientId as string,
    };

    if (isUpdatingExam) {
      updateExamMutation.mutate(parsedData);
    } else {
      createExamMutation.mutate(parsedData);
    }
  }

  const isSubmitButtonDisabled = !isValid;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        hideCloseButton
        closeModal={() => setIsModalOpen(false)}
        customClasses="w-140 flex flex-col gap-y-4"
      >
        {/* TODO: Adjust modal content */}
        <div className="flex items-center justify-center gap-x-2">
          <CircleCheck size={20} className="text-success" />
          <p className="font-medium">{`O tratamento foi ${isUpdatingExam ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingExam && (
            <Button
              id="create-new-exam-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outra exame</span>
              <UserRoundPlus size={16} />
            </Button>
          )}
          <Button
            id="dashboard-redirect-button"
            onClick={() => router.push('/dashboard')}
            customClasses="flex justify-center items-center gap-x-2"
          >
            <span>Ir para a dashboard</span>
            <ChartPie size={16} />
          </Button>
        </div>
      </Modal>

      <div className="flex flex-1 flex-col items-center justify-center pb-8">
        <h1 className="mb-8 text-2xl">{`${isUpdatingExam ? 'Atualização' : 'Cadastro'} de exame`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <Input
              name="treponemalTestType"
              label="Tipo de teste treponêmico"
              placeholder="Tipo de teste treponêmico"
              errorMessage={errors.treponemalTestType?.message}
              control={control}
            />
            <Input
              name="treponemalTestResult"
              label="Resultado do teste treponêmico"
              placeholder="Resultado do teste treponêmico"
              errorMessage={errors.treponemalTestResult?.message}
              control={control}
            />
            <Datepicker
              name="treponemalTestDate"
              label="Data do teste treponêmico"
              errorMessage={errors.treponemalTestDate?.message}
              control={control}
            />
            <Input
              name="treponemalTestLocation"
              label="Local do teste treponêmico"
              placeholder="Local do teste treponêmico"
              errorMessage={errors.treponemalTestLocation?.message}
              control={control}
            />
            <Input
              name="nontreponemalVdrlTest"
              label="Teste VDRL não treponêmico"
              placeholder="Teste VDRL não treponêmico"
              errorMessage={errors.nontreponemalVdrlTest?.message}
              control={control}
            />
            <Input
              name="nontreponemalTestTitration"
              label="Titulação do teste não treponêmico"
              placeholder="Titulação do teste não treponêmico"
              errorMessage={errors.nontreponemalTestTitration?.message}
              control={control}
            />
            <Datepicker
              name="nontreponemalTestDate"
              label="Data do teste não treponêmico"
              errorMessage={errors.nontreponemalTestDate?.message}
              control={control}
            />
            <Input
              name="otherNontreponemalTest"
              label="Outro teste não treponêmico"
              placeholder="Outro teste não treponêmico"
              errorMessage={errors.otherNontreponemalTest?.message}
              control={control}
            />
            <Datepicker
              name="otherNontreponemalTestDate"
              label="Data do outro teste não treponêmico"
              errorMessage={errors.otherNontreponemalTestDate?.message}
              control={control}
            />
            <TextArea
              name="referenceObservations"
              label="Observações de referência"
              placeholder="Observações de referência"
              errorMessage={errors.referenceObservations?.message}
              control={control}
            />
            <Button
              id="create-exam-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingExam ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}
