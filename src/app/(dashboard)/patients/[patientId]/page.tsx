'use client';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Datepicker from '@/components/atoms/Datepicker';
import Input from '@/components/atoms/Input';
import Modal from '@/components/atoms/Modal';
import Select from '@/components/atoms/Select';
import { REGEX } from '@/constants/common';
import { CreatePatientDTO, UpdatePatientDTO } from '@/services/types/patients';
import { formatSafeBirthDate } from '@/utils/date';
import { formatToDateString } from '@/utils/formatToDateString';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import {
  createPatientAction,
  getPatientAction,
  updatePatientAction,
} from '@/app/actions/patientActions';

import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SCHOOLING_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/constants/patients';

import {
  getInvalidFormatMessage,
  getMinLengthMessage,
  getRequiredMessage,
} from '@/utils/validation';

export default function PatientForm() {
  const router = useRouter();
  const { patientId } = useParams();
  const isUpdatingPatient = !!patientId && patientId !== 'new';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    susCardNumber: z
      .string()
      .min(1, getRequiredMessage('Número do cartão do SUS'))
      .regex(/\d{15}/g, getMinLengthMessage('Número do cartão do SUS', 15)),
    name: z.string().min(1, getRequiredMessage('Nome')),
    cpf: z
      .string()
      .min(1, getRequiredMessage('CPF'))
      .regex(REGEX.cpf, getInvalidFormatMessage('CPF')),
    socialName: z.string().nullable().optional(),
    birthDate: z
      .string()
      .min(1, getRequiredMessage('Data de nascimento'))
      .regex(REGEX.date, getInvalidFormatMessage('Data de nascimento')),
    race: z.enum(
      RACE_OPTIONS.map((option) => option.value),
      getRequiredMessage('Raça')
    ),
    sex: z.enum(
      SEX_OPTIONS.map((option) => option.value),
      getRequiredMessage('Sexo')
    ),
    gender: z.enum(
      GENDER_OPTIONS.map((option) => option.value),
      getRequiredMessage('Gênero')
    ),
    sexuality: z.enum(
      SEXUALITY_OPTIONS.map((option) => option.value),
      getRequiredMessage('Sexualidade')
    ),
    nationality: z.enum(
      NATIONALITY_OPTIONS.map((option) => option.value),
      getRequiredMessage('Nacionalidade')
    ),
    schooling: z.enum(
      SCHOOLING_OPTIONS.map((option) => option.value),
      getRequiredMessage('Escolaridade')
    ),
    phone: z
      .string()
      .nullable()
      .optional()
      .refine((val) => !val || REGEX.phone.test(val), {
        message:
          'Por favor, insira um telefone no seguinte formato: +XX (XX) 9XXXX-XXXX.',
      }),
    email: z.string().nullable().optional(),
    motherName: z.string().min(1, getRequiredMessage('Nome da mãe')),
    fatherName: z.string().nullable().optional(),
    isDeceased: z.boolean(),
    monitoringType: z
      .string()
      .min(1, getRequiredMessage('Tipo de monitoramento')),
    zipCode: z.string().nullable().optional(),
    state: z.string().min(1, getRequiredMessage('Estado')),
    city: z.string().min(1, getRequiredMessage('Cidade')),
    neighborhood: z.string().min(1, getRequiredMessage('Bairro')),
    street: z.string().min(1, getRequiredMessage('Rua')),
    houseNumber: z.string().min(1, getRequiredMessage('Número da casa')),
    complement: z.string().nullable().optional(),
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

  const { data: getPatientResponse, isSuccess } = useQuery({
    queryKey: ['patients', patientId],
    queryFn: () => getPatientAction(patientId as string),
    enabled: isUpdatingPatient,
  });

  const createPatientMutation = useMutation({
    mutationFn: (data: CreatePatientDTO) => createPatientAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: (data: UpdatePatientDTO) =>
      updatePatientAction(patientId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    if (isSuccess && getPatientResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getPatientResponse.data)
            .filter(([key]) => !['birthDate', 'houseNumber'].includes(key)) // Exclude birthDate from the spread
            .map(([key, value]) => [key, value === null ? undefined : value])
        ),
        birthDate: formatSafeBirthDate(getPatientResponse.data.birthDate),
        houseNumber: String(getPatientResponse.data.houseNumber),
      };

      reset(formData);

      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [isSuccess, getPatientResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreatePatientDTO = {
      ...data,
      socialName: data.socialName ?? null,
      birthDate: data.birthDate ? formatToDateString(data.birthDate) : null,
      race: data.race ?? null,
      sex: data.sex ?? null,
      gender: data.gender ?? null,
      sexuality: data.sexuality ?? null,
      nationality: data.nationality ?? null,
      schooling: data.schooling ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      fatherName: data.fatherName ?? null,
      zipCode: data.zipCode ?? null,
      houseNumber: Number(data.houseNumber),
      complement: data.complement ?? null,
    };

    if (isUpdatingPatient) {
      updatePatientMutation.mutate(parsedData);
    } else {
      createPatientMutation.mutate(parsedData);
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
          <p className="font-medium">{`O paciente foi ${isUpdatingPatient ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingPatient && (
            <Button
              id="create-new-patient-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outro paciente</span>
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
        <h1 className="mb-8 text-2xl">{`${isUpdatingPatient ? 'Atualização' : 'Cadastro'} de paciente`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <Checkbox
              name="isDeceased"
              label="Paciente falecido?"
              control={control}
            />
            <Input
              name="susCardNumber"
              label="Número do cartão do SUS"
              placeholder="Número do cartão do SUS"
              mask="sus-card-number"
              errorMessage={errors.susCardNumber?.message}
              control={control}
            />
            <Input
              name="name"
              label="Nome"
              placeholder="Nome"
              errorMessage={errors.name?.message}
              control={control}
            />
            <Input
              name="cpf"
              label="CPF"
              placeholder="CPF"
              mask="cpf"
              errorMessage={errors.cpf?.message}
              control={control}
            />
            <Input
              name="socialName"
              label="Nome social"
              placeholder="Nome social"
              errorMessage={errors.socialName?.message}
              control={control}
            />
            <Datepicker
              name="birthDate"
              label="Data de nascimento"
              control={control}
              errorMessage={errors.birthDate?.message}
            />
            <Select
              name="race"
              label="Raça"
              options={RACE_OPTIONS}
              placeholder="Raça"
              errorMessage={errors.race?.message}
              control={control}
            />
            <Select
              name="sex"
              label="Sexo"
              options={SEX_OPTIONS}
              placeholder="Sexo"
              errorMessage={errors.sex?.message}
              control={control}
            />
            <Select
              name="gender"
              label="Gênero"
              options={GENDER_OPTIONS}
              errorMessage={errors.gender?.message}
              control={control}
            />
            <Select
              name="sexuality"
              label="Sexualidade"
              placeholder="Sexualidade"
              options={SEXUALITY_OPTIONS}
              errorMessage={errors.sexuality?.message}
              control={control}
            />
            <Select
              name="nationality"
              label="Nacionalidade"
              options={NATIONALITY_OPTIONS}
              errorMessage={errors.nationality?.message}
              control={control}
            />
            <Select
              name="schooling"
              label="Escolaridade"
              placeholder="Escolaridade"
              options={SCHOOLING_OPTIONS}
              errorMessage={errors.schooling?.message}
              control={control}
            />
            <Input
              name="phone"
              label="Telefone"
              placeholder="Telefone"
              mask="phone"
              errorMessage={errors.phone?.message}
              control={control}
            />
            <Input
              name="email"
              label="E-mail"
              placeholder="E-mail"
              errorMessage={errors.email?.message}
              control={control}
            />
            <Input
              name="motherName"
              label="Nome da mãe"
              placeholder="Nome da mãe"
              errorMessage={errors.motherName?.message}
              control={control}
            />
            <Input
              name="fatherName"
              label="Nome do pai"
              placeholder="Nome do pai"
              errorMessage={errors.fatherName?.message}
              control={control}
            />
            <Input
              name="monitoringType"
              label="Tipo de monitoramento"
              placeholder="Tipo de monitoramento"
              errorMessage={errors.monitoringType?.message}
              control={control}
            />
            <Input
              name="zipCode"
              label="CEP"
              placeholder="CEP"
              errorMessage={errors.zipCode?.message}
              control={control}
            />
            <Input
              name="state"
              label="Estado"
              placeholder="Estado"
              errorMessage={errors.state?.message}
              control={control}
            />
            <Input
              name="city"
              label="Cidade"
              placeholder="Cidade"
              errorMessage={errors.city?.message}
              control={control}
            />
            <Input
              name="neighborhood"
              label="Bairro"
              placeholder="Bairro"
              errorMessage={errors.neighborhood?.message}
              control={control}
            />
            <Input
              name="street"
              label="Rua"
              placeholder="Rua"
              errorMessage={errors.street?.message}
              control={control}
            />
            <Input
              name="houseNumber"
              label="Número da casa"
              placeholder="Número da casa"
              mask="number"
              errorMessage={errors.houseNumber?.message}
              control={control}
            />
            <Input
              name="complement"
              label="Complemento"
              placeholder="Complemento"
              errorMessage={errors.complement?.message}
              control={control}
            />
            <Button
              id="create-patient-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingPatient ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}
