import { useCurrentAddress, useRoochClient } from "@roochnetwork/rooch-sdk-kit";
import { useQuery } from "@tanstack/react-query";
import { useNetworkVariable } from "./use-networks";
import { Args } from "@roochnetwork/rooch-sdk";

export default function useUserCheck() {
  const client = useRoochClient();
  const packageId = useNetworkVariable("packageId");
  const address = useCurrentAddress();

  const {
    data: exists,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["useUserCheck", address],
    queryFn: async () => {
      const result = await client.executeViewFunction({
        target: `${packageId}::user_profile::exists_profile`,
        args: [Args.address(address!.genRoochAddress().toHexAddress())],
      });

      console.log(result)
      return (result?.return_values?.[0]?.decoded_value as boolean) || false;
    },
    enabled: !!address,
  });

  return {
    exists: exists === undefined ? true : exists, // if exists undefind, may be not connect wallet, dont tigger user init action
    isPending,
    isError,
    refetch,
  };
}
