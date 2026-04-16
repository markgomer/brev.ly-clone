export type Failure<T> = {
  failure: T
  success?: never
}

export type Success<U> = {
  failure?: never
  success: U
}

export type Either<T, U> = NonNullable<Failure<T> | Success<U>>

export type UnwrapEither = <T, U>(e: Either<T, U>) => NonNullable<T | U>

export const isFailure = <T, U>(e: Either<T, U>): e is Failure<T> => {
  return e.failure !== undefined
}

export const isSuccess = <T, U>(e: Either<T, U>): e is Success<U> => {
  return e.success !== undefined
}

export const unwrapEither: UnwrapEither = <T, U>({
  failure,
  success,
}: Either<T, U>) => {
  if (success !== undefined && failure !== undefined) {
    throw new Error(
      `Received both failure and success values at runtime when opening an Either\nFailure: ${JSON.stringify(
        failure
      )}\nSuccess: ${JSON.stringify(success)}`
    )
  }

  if (failure !== undefined) {
    return failure as NonNullable<T>
  }

  if (success !== undefined) {
    return success as NonNullable<U>
  }

  throw new Error(
    'Received no failure or success values at runtime when opening Either'
  )
}

export const makeFailure = <T>(value: T): Failure<T> => ({ failure: value })

export const makeSuccess = <U>(value: U): Success<U> => ({ success: value })
